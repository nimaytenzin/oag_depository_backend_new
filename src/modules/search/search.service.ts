import { Inject, Injectable, Logger } from "@nestjs/common";
import { DataSet, DeleteInput, searchCharacterByKeyword } from "./search.dto";
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';


@Injectable()
export class SearchService {
    // private openSearchClient: any;
    logger: Logger;

    constructor(
        // @Inject("Open_Search_JS_Client") openSearchClient
        @InjectOpensearchClient()
        private readonly openSearchClient: OpensearchClient,
    ) {
        // this.openSearchClient = searchClient.instance;
        this.logger = new Logger();
    }

    async singleDataIngestion(input: DataSet): Promise<any> {
        this.logger.log(
            `Inside singleUpload() Method | Ingesting single data with index ${input.indexName} and id ${input.characters[0].id} `
        );

        let character = input.characters[0];

        try {
            let res = await this.openSearchClient.index({
                index: input.indexName,
                body: {
                    id: character.id,
                    clause_eng: character.clause_eng,
                    clause_dzo: character.clause_dzo,
                },
            });
            return res.body;
        } catch (err) {
            this.logger.error(`Exception occurred : ${err})`);
            return {
                httpCode: 500,
                error: err,
            };
        }
    }

    async bulkDataIngestion(input: DataSet): Promise<any> {
        this.logger.log(
            `Inside bulkUpload() Method | Ingesting Bulk data of length ${input.characters.length} having index ${input.indexName}`
        );

        const body = input.characters.flatMap((doc) => {
            return [{ index: { _index: input.indexName, _id: doc.id } }, doc];
        });

        try {
            let res = await this.openSearchClient.bulk({ body });
            return res.body;
        } catch (err) {
            this.logger.error(`Exception occurred : ${err})`);
            return {
                httpCode: 500,
                error: err,
            };
        }

    }

    async searchCharacterByKeyword(input: searchCharacterByKeyword): Promise<any> {
        this.logger.log(`Inside searchByKeyword() Method`);
        let body: any;

        this.logger.log(
            `Searching for Keyword: ${input.keyword} in the index : ${input.indexName} `
        );
        body = {
            query: {
                multi_match: {
                    query: input.keyword,
                },
            },
        };

        try {
            let res = await this.openSearchClient.search({
                index: input.indexName,
                body,
            });
            if (res.body.hits.total.value == 0) {
                return {
                    httpCode: 200,
                    data: [],
                    message: `No Data found based based on Keyword: ${input.keyword}`,
                };
            }
            let result = res.body.hits.hits.map((item) => {
                return {
                    _id: item._id,
                    data: item._source,
                };
            });

            return {
                httpCode: 200,
                data: result,
                message: `Data fetched successfully based on Keyword: ${input.keyword}`,
            };
        } catch (error) {
            this.logger.error(`Exception occurred while doing : ${error})`);
            return {
                httpCode: 500,
                data: [],
                error: error,
            };
        }
    }

    async purgeIndex(input: DeleteInput): Promise<any> {
        this.logger.log(`Inside purgeIndex() Method`);
        try {
            this.logger.log(`Deleting all records having index: ${input.indexName}`);

            await this.openSearchClient.indices.delete({
                index: input.indexName,
            });

            return {
                httpCode: 200,
                message: `Record deleted having index: ${input.indexName}, characterId: ${input.id}`,
            };
        } catch (error) {
            this.logger.error(`Exception occurred while doing : ${error})`);
            return {
                httpCode: 500,
                error: error,
            };
        }
    }

    async purgeDocumentById(input: DeleteInput): Promise<any> {

    }
}