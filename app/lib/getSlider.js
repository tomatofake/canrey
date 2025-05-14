import { client } from "./sanity";

export const getSlider = async () => {
    const query = `*[_type == "slider"][0]{
      title,
      slides[]{
        image{
          asset->{
            url
          }
        }
      }
    }`;
    return await client.fetch(query);
  };
  
  