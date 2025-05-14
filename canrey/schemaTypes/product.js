export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string'
    },
    {
      name: 'description',
      title: 'Product Description',
      type: 'string'
    },
    {
      name: 'size',
      title: 'Product Size',
      type: 'string'
    },
    {
      name: 'color',
      title: 'Product Color',
      type: 'string'
    },
    {
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      name: 'slug',
      title: 'Product Slug',
      type: 'slug',
      options: {
          source: 'name'
      },
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}]
    },

    // 🔌 Додаткові поля з фільтрацією по категоріях
    {
      name: 'features',
      title: 'Особливості',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !(
          cats.includes('0b7a0650-227a-49bb-8ef4-66a5f88fb605') || // духовки
          cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd')     // плити
        );
      }
    },
    {
      name: 'volume',
      title: "Об'єм",
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('0b7a0650-227a-49bb-8ef4-66a5f88fb605');
      }
    },
    {
      name: 'bodyMaterial',
      title: 'Матеріал корпусу',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('0b7a0650-227a-49bb-8ef4-66a5f88fb605');
      }
    },
    {
      name: 'ovenType',
      title: 'Тип духовки',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'electricIgnitionTop',
      title: 'Електропіджиг поверхні',
      type: 'boolean',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'electricIgnitionBottom',
      title: 'Електропіджиг духовки',
      type: 'boolean',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'ovenCategory',
      title: 'Тип плити',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'surfaceConfiguration',
      title: 'Конфігурація поверхні',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'gridMaterial',
      title: 'Матеріал решіток поверхні',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'power',
      title: 'Потужність',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('8a1f69a9-4f06-4b6c-9a0b-c910db31a636');
      }
    },
    {
      name: 'installationType',
      title: 'Тип монтажу',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('8a1f69a9-4f06-4b6c-9a0b-c910db31a636');
      }
    },
    {
      name: 'gasType',
      title: 'Тип газу',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('8a1f69a9-4f06-4b6c-9a0b-c910db31a636');
      }
    },
    {
      name: 'workingArea',
      title: 'Площа роботи',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('8a1f69a9-4f06-4b6c-9a0b-c910db31a636');
      }
    },
    {
      name: 'heatExchangerMaterial',
      title: 'Матеріал теплообміннику',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('8a1f69a9-4f06-4b6c-9a0b-c910db31a636');
      }
    }
  ]
};
