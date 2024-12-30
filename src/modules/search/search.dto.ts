import { integer } from "@opensearch-project/opensearch/api/types";

export class DataSet {
    indexName: string;
    characters: Characters[];
  }
  
  export class Characters {
    id: integer;
    clause_eng: string;
    clause_dzo: string;
  }
  
  export class DeleteInput {
    indexName: string;
    id?: string;
  }
  
  export class searchCharacterByKeyword {
    indexName: string;
    keyword: string;
  }