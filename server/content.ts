type TypeFromEnum<
  RequiredKeys extends string,
  OptionalKeys extends string = ''
> = { [key in RequiredKeys]: any } & Partial<{ [key in OptionalKeys]: any }>;

export enum ContentBaseRequiredKeys {
  path,
  title,
  template,
  templateData,
}

export enum ContentBaseOptionalKeys {
  metaDescription,
  metaImage,
}

export type ContentBase = TypeFromEnum<
  keyof typeof ContentBaseRequiredKeys,
  keyof typeof ContentBaseOptionalKeys
>;

export type ContentWithTemplate = ContentBase & {
  templateData: Record<string, any>;
};

export type ContentForIndex = ContentBase & {
  templateHtml: string;
};

export function getEnumKeys(from: object): string[] {
  return Object.keys(from).filter((key) => Number.isNaN(parseInt(key, 10)));
}
