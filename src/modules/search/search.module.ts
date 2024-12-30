import { Module, DynamicModule } from "@nestjs/common";
import { Client } from "@opensearch-project/opensearch";
import { SearchService } from "./search.service";
import { OpensearchModule } from "nestjs-opensearch";


@Module({
  imports: [
    OpensearchModule.forRoot({
      // node: "https://admin:323395Kt!@172.30.84.82:9200/",
      node: "https://admin:323395Kt!@localhost:9200/",
      ssl: {
        rejectUnauthorized: false,
      },
    }),
  ],
  providers: [SearchService],
  exports:[SearchService]
})
export class SearchModule { }