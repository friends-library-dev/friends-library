import { GatsbyNode, CreateSchemaCustomizationArgs } from 'gatsby';

const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = async ({
  actions: { createTypes },
}: CreateSchemaCustomizationArgs) => {
  const typeDef = `
    type Document implements Node {
      altLanguageUrl: String
    }
    type Edition implements Node {
      description: String
      audio: Audio
      chapterHeadings: [ChapterHeading!]!
    } 
    type ChapterHeading {
      id: String!
      text: String!
      shortText: String
      sequence: ChapterHeadingSequence
    }
    type ChapterHeadingSequence {
      type: String!
      number: Int!
    } 
    type Audio {
      reader: String!
      url: String!
      podcastUrl: String!
      parts: [AudioPart!]!
    }
    type AudioPart {
      seconds: Int!
      filesizeHq: Int!
      filesizeLq: Int!
      externalIdHq: Int!
      externalIdLq: Int!
      title: String!
      chapters: [Int!]!
    }
  `;
  createTypes(typeDef);
};

export default createSchemaCustomization;
