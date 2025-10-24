import {createClient} from 'next-sanity';
import ImageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'k47k299i',
  dataset: 'production',
  apiVersion: '2025-01-12',
  useCdn: true,
});

const imgBuilder = ImageUrlBuilder(client);

export function urlFor(source) {
  return imgBuilder.image(source);
}

export const getData = async (categoryName) => {
  const query = `
    *[_type == 'product' && references(*[_type == 'category' && name == $categoryName]._id)] {
      _id,
      name,
      description,
      specs,
      size,
      color,
      features,
      volume,
      bodyMaterial,
      ovenType,
      electricIgnition,
      gridMaterial,
      power,
      installationType,
      gasType,
      workingArea,
      heatExchangerMaterial,
      surfaceConfiguration, // ✅ ДОБАВИЛИ ЭТО
      images[]{ asset->{url} },
      "slug": slug.current,
      "categories": categories[]-> { name }
    }
  `;
  const params = { categoryName };
  const data = await client.fetch(query, params);
  return data;
};