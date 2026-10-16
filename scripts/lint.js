// ESLint 9 legacy-config bridge for the existing Next core-web-vitals rules.
(async()=>{
 const {loadESLint}=require('eslint');
 const ESLint=await loadESLint({useFlatConfig:false});
 const eslint=new ESLint({extensions:['.js','.ts','.tsx'],errorOnUnmatchedPattern:false,overrideConfig:{ignorePatterns:['.next/**','node_modules/**','data/**']}});
 const results=await eslint.lintFiles(['app','components','lib','types','next.config.mjs','tailwind.config.ts']);
 const formatter=await eslint.loadFormatter('stylish');const output=formatter.format(results);if(output)console.log(output);
 const errors=results.reduce((n,r)=>n+r.errorCount,0),warnings=results.reduce((n,r)=>n+r.warningCount,0);
 console.log(`ESLint: ${errors} errors, ${warnings} warnings.`);if(errors)process.exitCode=1;
})().catch(e=>{console.error(e.message);process.exitCode=1});
