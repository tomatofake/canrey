export default {
    name: 'Slider',
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
            fields: [
              {
                name: 'image',
                title: 'Зображення',
                type: 'image',
                options: {
                  hotspot: true,
                },
              },
            ],
          },
        ],
      },
    ],
  };
  