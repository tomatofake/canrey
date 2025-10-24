import { client } from './sanity';

export const getSlider = async () => {
  const query = `*[_type == "slider"][0]{
    title,
    slides[]{
      text,
      image{ asset->{ url } }
    }
  }`;
  return client.fetch(query);
};