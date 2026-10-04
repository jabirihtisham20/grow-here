import { config, fields, collection, singleton } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';

const useGitHub =
  process.env.NODE_ENV === 'production' ||
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === 'github';

const repoOwner = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER || 'jabirihtisham20';
const repoName = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME || 'grow-here';

const customContentComponents = {
  Callout: wrapper({
    label: 'Callout Box',
    schema: {
      title: fields.text({
        label: 'Callout Title',
        defaultValue: 'Editorial Note',
      }),
    },
  }),
  Tip: wrapper({
    label: 'Pro Tip Box',
    schema: {
      title: fields.text({
        label: 'Tip Title',
        defaultValue: 'Pro Tip',
      }),
    },
  }),
  Warning: wrapper({
    label: 'Warning Box',
    schema: {
      title: fields.text({
        label: 'Warning Title',
        defaultValue: 'Important Caution',
      }),
    },
  }),
  Quote: wrapper({
    label: 'Editorial Quote',
    schema: {
      author: fields.text({ label: 'Author Name' }),
      source: fields.text({ label: 'Source / Book / Context' }),
    },
  }),
  ArticleImage: block({
    label: 'Article Image (with Caption)',
    schema: {
      src: fields.text({
        label: 'Image URL or Local Path',
        defaultValue: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1200&q=80',
      }),
      alt: fields.text({ label: 'Image Alt Description' }),
      caption: fields.text({ label: 'Photo Caption' }),
    },
  }),
  ProsCons: block({
    label: 'Pros & Cons List',
    schema: {
      pros: fields.array(fields.text({ label: 'Advantage item' }), {
        label: 'Pros (The Advantages)',
        itemLabel: (props) => props.value,
      }),
      cons: fields.array(fields.text({ label: 'Consideration item' }), {
        label: 'Cons (Drawbacks & Considerations)',
        itemLabel: (props) => props.value,
      }),
    },
  }),
  Steps: block({
    label: 'Numbered Steps Guide',
    schema: {
      steps: fields.array(
        fields.object({
          title: fields.text({ label: 'Step Title' }),
          description: fields.text({
            label: 'Step Instructions',
            multiline: true,
          }),
        }),
        {
          label: 'Steps List',
          itemLabel: (props) => props.fields.title.value || 'Step',
        }
      ),
    },
  }),
  FAQ: block({
    label: 'FAQ Accordion',
    schema: {
      title: fields.text({
        label: 'FAQ Header Title',
        defaultValue: 'Frequently Asked Questions',
      }),
      items: fields.array(
        fields.object({
          question: fields.text({ label: 'Question' }),
          answer: fields.text({
            label: 'Answer',
            multiline: true,
          }),
        }),
        {
          label: 'Questions & Answers',
          itemLabel: (props) => props.fields.question.value || 'Question',
        }
      ),
    },
  }),
  ComparisonTable: block({
    label: 'Comparison Table',
    schema: {
      caption: fields.text({ label: 'Table Caption (Optional)' }),
      headers: fields.array(fields.text({ label: 'Header Column' }), {
        label: 'Table Columns',
        itemLabel: (props) => props.value,
      }),
      rows: fields.array(
        fields.array(fields.text({ label: 'Cell Value' }), {
          label: 'Row Cells',
        }),
        { label: 'Table Rows' }
      ),
    },
  }),
};

function createPillarCollection(
  pillarKey: string,
  pillarLabel: string,
  subtopics: string[]
) {
  return collection({
    label: pillarLabel,
    slugField: 'title',
    path: `content/${pillarKey}/*`,
    format: { contentField: 'content' },
    schema: {
      title: fields.slug({
        name: {
          label: 'Article Title',
          validation: { isRequired: true },
        },
        slug: {
          label: 'Slug (URL path)',
          validation: {
            pattern: {
              regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: 'Use lowercase letters and numbers separated by single hyphens.',
            },
          },
        },
      }),
      description: fields.text({
        label: 'Summary / Excerpt',
        multiline: true,
        validation: { isRequired: true },
      }),
      category: fields.text({
        label: 'Category Pillar',
        defaultValue: pillarKey,
      }),
      subcategory: fields.select({
        label: 'Subcategory Topic',
        options: subtopics.map((topic) => ({ label: topic, value: topic })),
        defaultValue: subtopics[0],
      }),
      author: fields.object({
        name: fields.text({
          label: 'Author Name',
          defaultValue: 'Elena Vance',
        }),
        role: fields.text({
          label: 'Author Role',
          defaultValue: 'Botanical Stylist & Horticulturist',
        }),
        avatar: fields.text({
          label: 'Author Avatar URL',
          defaultValue:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        }),
      }),
      publishedAt: fields.date({
        label: 'Published Date',
        defaultValue: { kind: 'today' },
      }),
      updatedAt: fields.text({
        label: 'Last Updated Date (Optional)',
      }),
      image: fields.image({
        label: 'Featured Hero Image',
        directory: 'public/images/posts',
        publicPath: '/images/posts',
      }),
      imageAlt: fields.text({
        label: 'Image Accessibility Alt Text',
      }),
      featured: fields.checkbox({
        label: 'Featured Article (Top Hero Feature)',
        defaultValue: false,
      }),
      editorsPick: fields.checkbox({
        label: "Editor's Pick Highlight",
        defaultValue: false,
      }),
      status: fields.select({
        label: 'Publication Status',
        options: [
          { label: 'Published (Publicly Visible)', value: 'published' },
          { label: 'Draft (Editorial Preview Only)', value: 'draft' },
        ],
        defaultValue: 'published',
      }),
      readingTime: fields.text({
        label: 'Estimated Reading Time',
        defaultValue: '5 min read',
      }),
      tags: fields.array(fields.text({ label: 'Tag' }), {
        label: 'Article Tags',
        itemLabel: (props) => props.value,
      }),
      seoTitle: fields.text({
        label: 'SEO Title (Overrides title tag)',
      }),
      metaDescription: fields.text({
        label: 'SEO Meta Description',
        multiline: true,
      }),
      primaryKeyword: fields.text({
        label: 'Primary Target Keyword',
      }),
      secondaryKeywords: fields.array(fields.text({ label: 'Secondary Keyword' }), {
        label: 'Secondary Keywords',
        itemLabel: (props) => props.value,
      }),
      noindex: fields.checkbox({
        label: 'Prevent Search Indexing (noindex)',
        defaultValue: false,
      }),
      content: fields.mdx({
        label: 'Article Body Content (MDX)',
        options: {
          image: {
            directory: 'public/images/posts',
            publicPath: '/images/posts',
          },
        },
        components: customContentComponents,
      }),
    },
  });
}

export default config({
  storage: useGitHub
    ? {
        kind: 'github',
        repo: {
          owner: repoOwner,
          name: repoName,
        },
      }
    : {
        kind: 'local',
      },
  collections: {
    grow: createPillarCollection('grow', '🌱 Grow Collection', [
      'Indoor Plants',
      'Plant Care',
      'Balcony Gardening',
      'Herbs',
      'Hydroponics',
      'Urban Gardening',
      'Composting',
    ]),
    space: createPillarCollection('space', '🏠 Space Collection', [
      'Organization',
      'Small Homes',
      'Decluttering',
      'Storage',
      'Cleaning',
      'Apartment Living',
      'Functional Design',
    ]),
    energy: createPillarCollection('energy', '⚡ Energy Collection', [
      'Energy Saving',
      'Solar',
      'Appliances',
      'Heating & Cooling',
      'Smart Homes',
      'Insulation',
      'Renewable Energy',
    ]),
    life: createPillarCollection('life', '🧘 Life Collection', [
      'Minimalism',
      'Mindfulness',
      'Digital Wellness',
      'Habits',
      'Productivity',
      'Slow Living',
      'Intentional Living',
    ]),
  },
  singletons: {
    settings: singleton({
      label: 'Site Settings',
      path: 'content/settings',
      format: { data: 'json' },
      schema: {
        siteName: fields.text({
          label: 'Site Name',
          defaultValue: 'Grow Here',
        }),
        siteDescription: fields.text({
          label: 'Site Description',
          multiline: true,
          defaultValue:
            'A modern editorial publication on mindful living, sustainable energy, small spaces, and botanical care.',
        }),
        siteUrl: fields.text({
          label: 'Site URL',
          defaultValue: 'https://growhere.online',
        }),
        announcement: fields.text({
          label: 'Header Announcement Banner (Optional)',
        }),
      },
    }),
  },
});
