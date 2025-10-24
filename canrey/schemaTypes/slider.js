export default {
  name: 'slider',
  title: 'Главный Слайдер',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Назва',
      type: 'string',
    },
    {
      name: 'slides',
      title: 'Слайди',
      type: 'array',
      of: [
        {
          type: 'object',
          options: { collapsible: true, collapsed: false },
          fields: [
            {
              name: 'image',
              title: 'Зображення',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'text',
              title: 'Текст слайду',
              type: 'text',
              rows: 3,
            },
          ],
          preview: {
            select: { media: 'image', title: 'text' },
            prepare({ media, title }) {
              return { title: title || 'Без тексту', media };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    },
  ],
};