import axios from "axios";

const resolvers = {
  Query: {
    countries: async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        return response.data.map((country) => ({
          name: { common: country.name.common },
          flag: country.flag,
          population: country.population,
          region: country.region,
          capital: country.capital || [],
        }));
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch countries");
      }
    },
    countryByName: async (_, { name }) => {
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/name/${name}?fullText=true`
        );
        const country = response.data[0];

        // Transform native names
        const nativeName = Object.entries(country.name.nativeName).map(
          ([key, value]) => ({
            language: key,
            official: value.official,
            common: value.common,
          })
        );

        // Transform currencies
        const currencies = Object.entries(country.currencies).map(
          ([key, value]) => ({
            code: key,
            name: value.name,
            symbol: value.symbol,
          })
        );

        console.log({currencies})

        // Transform languages
        const languages = Object.entries(country.languages).map(
          ([key, value]) => ({
            key: key,
            value: value,
          })
        );


        return {
          name: {
            common: country.name.common,
            official: country.name.official,
            nativeName: nativeName,
          },
          flag: country.flags.svg,
          population: country.population,
          region: country.region,
          capital: country.capital || [],
          currencies: currencies,
          borders: country.borders || [],
          flags: {
            png: country.flags.png,
            svg: country.flags.svg,
            alt: country.flags.alt,
          },
          languages: languages,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch country");
      }
    },
  },
};

export default resolvers;
