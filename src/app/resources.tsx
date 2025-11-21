import { ResourceProps } from "@refinedev/core";

export const resources: ResourceProps[] = [
  {
    name: "properties",
    list: "/properties",
    create: "/properties/create",
    edit: "/properties/edit/:id",
    show: "/properties/show/:id",
    meta: {
      label: "Propiedades",
      icon: "🏠",
    },
  },
];