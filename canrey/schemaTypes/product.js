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
      name: 'dimensions',
      title: 'Габарити (В х Ш х Г)',
      type: 'string'
    },
    {
      name: 'packageDimensions',
      title: 'Габарити в упаковці (ВхШхГ)',
      type: 'string',
    },
    {
      name: 'color',
      title: 'Product Color',
      type: 'string'
    },
    {
      name: 'weight',
      title: 'Вага, кг',
      type: 'string',
    },
    {
      name: 'weightPackaged',
      title: 'Вага в упаковці, кг',
      type: 'string',
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
          cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd')    // плити
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
      name: 'powerCord',
      title: 'Наявність шнура живлення',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'networkConnection',
      title: 'Можливість підключення до мережі',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'gasConnection',
      title: 'Можливість підключення до балонного газу',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'innerCoating',
      title: 'Внутрішнє покриття',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !(
          cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd') || // плити
          cats.includes('0b7a0650-227a-49bb-8ef4-66a5f88fb605')    // духовки
        );
      }
    },
    {
      name: 'cleaningType',
      title: 'Тип очищення',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'railType',
      title: 'Тип напрямних',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    
    // 3) Змінено: Перейменував 'surfaceType' на 'surfaceConfiguration' і видалив старе поле
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
      name: 'lidType',
      title: 'Кришка варильної поверхні',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'packageContents',
      title: 'Комплектація',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !(
          cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd') || // плити
          cats.includes('0b7a0650-227a-49bb-8ef4-66a5f88fb605')    // духовки
        );
      }
    },
    {
      name: 'railLevels',
      title: 'Кількість рівнів напрямних',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'cookingModes',
      title: 'Кількість режимів приготування',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !(
          cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd') || // плити
          cats.includes('0b7a0650-227a-49bb-8ef4-66a5f88fb605')    // духовки
        );
      }
    },
    {
      name: 'ovenGlassCount',
      title: 'Кількість стекол у дверцятах духовки',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !(
          cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd') || // плити
          cats.includes('0b7a0650-227a-49bb-8ef4-66a5f88fb605')    // духовки
        );
      }
    },
    {
      name: 'grillType',
      title: 'Гриль',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'gasControl',
      title: 'Газ-контроль',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'gasNozzles',
      title: 'Форсунки для балонного газу',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    {
      name: 'plugIncluded',
      title: 'Наявність вилки',
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
      name: 'gridMaterial',
      title: 'Матеріал решіток поверхні',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd');
      }
    },
    
    // 1) Додано поле "Підсвітка духовки" для плит
    {
      name: 'ovenLighting',
      title: 'Підсвітка духовки',
      type: 'boolean',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('1f5d6b4a-c968-42ab-82f0-7d7c7f0827fd'); // Показувати тільки для плит
      }
    },

    {
      name: 'power',
      title: 'Номінальна теплова потужність',
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
      title: 'Площа обслуговування',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('8a1f69a9-4f06-4b6c-9a0b-c910db31a636');
      }
    },
    {
      name: 'heatExchangerMaterial',
      title: 'Матеріал теплообмінника',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('8a1f69a9-4f06-4b6c-9a0b-c910db31a636');
      }
    },
    
    // --- ПОЛЯ ДЛЯ ГАЗОВИХ КОНВЕКТОРІВ/КОТЛІВ --- //
    {
      name: 'combustionChamberDesign',
      title: 'Конструкція камери згоряння',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('8a1f69a9-4f06-4b6c-9a0b-c910db31a636');
      }
    },
    {
      name: 'ignitionType',
      title: 'Вид розпалу',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('8a1f69a9-4f06-4b6c-9a0b-c910db31a636');
      }
    },
    {
      name: 'gasConsumption',
      title: 'Витрата газу',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('8a1f69a9-4f06-4b6c-9a0b-c910db31a636');
      }
    },
    {
      name: 'chimneyDiameter',
      title: 'Діаметр димоходу',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('8a1f69a9-4f06-4b6c-9a0b-c910db31a636');
      }
    },
    {
      name: 'chimneyLength',
      title: 'Довжина димоходу',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('8a1f69a9-4f06-4b6c-9a0b-c910db31a636');
      }
    },

    // --- ПОЛЯ ДЛЯ ДУХОВОК --- //
    // 2) Прибрав у цих двох полях id плит ('1f5d6b4a...')
    {
      name: 'temperatureRange',
      title: 'Діапазон температури',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('0b7a0650-227a-49bb-8ef4-66a5f88fb605'); // Показувати ТІЛЬКИ для духовок
      }
    },
    {
      name: 'timer',
      title: 'Таймер',
      type: 'string',
      hidden: ({ document }) => {
        const cats = document.categories?.map(ref => ref._ref) || [];
        return !cats.includes('0b7a0650-227a-49bb-8ef4-66a5f88fb605'); // Показувати ТІЛЬКИ для духовок
      }
    }
  ]
};