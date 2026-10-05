const readline = require('node:readline');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function question(prompt) {
  const interface_ = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => interface_.question(prompt, (answer) => {
    interface_.close();
    resolve(answer.trim());
  }));
}

function hiddenQuestion(prompt) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
    return Promise.reject(new Error('Run this command in an interactive terminal so passwords are not exposed in command arguments.'));
  }
  return new Promise((resolve, reject) => {
    let value = '';
    const input = process.stdin;
    const output = process.stdout;
    const onData = (chunk) => {
      for (const character of chunk.toString('utf8')) {
        if (character === '\u0003') {
          cleanup();
          reject(new Error('Admin creation cancelled.'));
          return;
        }
        if (character === '\r' || character === '\n') {
          cleanup();
          output.write('\n');
          resolve(value);
          return;
        }
        if (character === '\u007f' || character === '\b') value = value.slice(0, -1);
        else if (character >= ' ' && character !== '\u007f') value += character;
      }
    };
    function cleanup() {
      input.off('data', onData);
      input.setRawMode(false);
      input.pause();
      output.write('\n');
    }
    output.write(prompt);
    input.setRawMode(true);
    input.resume();
    input.on('data', onData);
  });
}

function validatePassword(password) {
  if (password.length < 12) throw new Error('Password must be at least 12 characters.');
  if (Buffer.byteLength(password, 'utf8') > 72) throw new Error('Password must not exceed 72 UTF-8 bytes.');
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 5000 });
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', ['grow-here-admin-membership']);
      const superAdmins = await client.query('SELECT id,email,display_name,role,status,password_hash FROM cms_users WHERE role=\'SUPER_ADMIN\' FOR UPDATE');

      if (superAdmins.rowCount) {
        if (superAdmins.rowCount !== 1) {
          throw new Error('Multiple SUPER_ADMIN accounts exist. Bootstrap cannot safely determine which account to enroll.');
        }
        const legacyAccount = superAdmins.rows[0];
        if (legacyAccount.status !== 'ACTIVE' || legacyAccount.password_hash) {
          throw new Error('A SUPER_ADMIN account already has credentials or is not active. Bootstrap will not overwrite or replace it.');
        }

        console.log(`Enrolling existing SUPER_ADMIN: ${legacyAccount.display_name || '(no name)'} <${legacyAccount.email || '(no email)'}>.`);
        let email = legacyAccount.email;
        if (!email) {
          email = (await question('Email for this account: ')).toLowerCase();
          if (!emailPattern.test(email) || email.length > 254) throw new Error('Enter a valid email address.');
          const duplicate = await client.query('SELECT 1 FROM cms_users WHERE lower(email)=lower($1) AND id<>$2', [email, legacyAccount.id]);
          if (duplicate.rowCount) throw new Error('That email is already assigned to another CMS account.');
        }

        const password = await hiddenQuestion('New password (hidden): ');
        const confirmation = await hiddenQuestion('Confirm password (hidden): ');
        validatePassword(password);
        if (password !== confirmation) throw new Error('Passwords do not match.');
        const passwordHash = await bcrypt.hash(password, 12);
        const update = await client.query(
          `UPDATE cms_users SET password_hash=$1,password_changed_at=now()
           WHERE id=$2 AND role='SUPER_ADMIN' AND status='ACTIVE' AND password_hash IS NULL RETURNING id`,
          [passwordHash, legacyAccount.id]
        );
        if (update.rowCount !== 1) throw new Error('The SUPER_ADMIN account changed during enrollment. No credentials were updated.');
        if (!legacyAccount.email) {
          const update = await client.query(
            'UPDATE cms_users SET email=$1 WHERE id=$2 AND email IS NULL RETURNING id',
            [email, legacyAccount.id]
          );
          if (update.rowCount !== 1) throw new Error('The account email changed during enrollment. No credentials were updated.');
        }
        await client.query('COMMIT');
        console.log(`Set a password for the existing SUPER_ADMIN account ${email}.`);
        return;
      }

      const name = await question('Name: ');
      const email = (await question('Email: ')).toLowerCase();
      if (!name || name.length > 120) throw new Error('Enter a name of 1 to 120 characters.');
      if (!emailPattern.test(email) || email.length > 254) throw new Error('Enter a valid email address.');
      const password = await hiddenQuestion('Password (hidden): ');
      const confirmation = await hiddenQuestion('Confirm password (hidden): ');
      validatePassword(password);
      if (password !== confirmation) throw new Error('Passwords do not match.');
      const passwordHash = await bcrypt.hash(password, 12);

      const existing = await client.query('SELECT id,status,password_hash FROM cms_users WHERE email=$1 FOR UPDATE', [email]);
      if (existing.rowCount) {
        if (existing.rows[0].status !== 'ACTIVE' || existing.rows[0].password_hash) throw new Error('That email belongs to an existing CMS account. Choose a different email or use an authorized admin to manage it.');
        await client.query(
          `UPDATE cms_users SET display_name=$2,password_hash=$3,password_changed_at=now(),role='SUPER_ADMIN',updated_at=now() WHERE id=$1`,
          [existing.rows[0].id, name, passwordHash]
        );
        await client.query('INSERT INTO cms_activity_logs (user_id,action,entity,entity_id,metadata) VALUES ($1,$2,$3,$4,$5::jsonb)', [existing.rows[0].id, 'BOOTSTRAP_SUPER_ADMIN_CREATED', 'USER', existing.rows[0].id, JSON.stringify({ email })]);
      } else {
        const inserted = await client.query(
          `INSERT INTO cms_users (email,password_hash,display_name,role,status,password_changed_at)
           VALUES ($1,$2,$3,'SUPER_ADMIN','ACTIVE',now()) RETURNING id`,
          [email, passwordHash, name]
        );
        await client.query('INSERT INTO cms_activity_logs (user_id,action,entity,entity_id,metadata) VALUES ($1,$2,$3,$4,$5::jsonb)', [inserted.rows[0].id, 'BOOTSTRAP_SUPER_ADMIN_CREATED', 'USER', inserted.rows[0].id, JSON.stringify({ email })]);
      }
      await client.query('COMMIT');
      console.log(`Created the initial SUPER_ADMIN account ${email}.`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(`Admin bootstrap failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  if (typeof error === 'object' && error && 'code' in error && error.code) console.error(`Database error code: ${error.code}`);
  process.exitCode = 1;
});
