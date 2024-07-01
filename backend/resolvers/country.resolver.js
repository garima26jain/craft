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
  },
};

export default resolvers;
