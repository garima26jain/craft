interface searchType{
    value: string;
    label: string;
}


export const searchOptions:searchType[] = [
    { value: "name", label: "Country Name" },
    { value: "region", label: "Region" },
    { value: "lang", label: "Language" },
    { value: "currency", label: "Currency" },
  ];