import { AuthService } from './modules/auth/auth.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import configuration from './configs/configuration';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/roles.guard';

import { DatabaseModule } from './database/database.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DocumentCopyModule } from './modules/storage/document-copy/document-copy.module';
import { AnnexureModule } from './modules/storage/annexure/annexure.module';
import { LegislationModule } from './modules/legislations/legislation/legislation.module';
import { SectionModule } from './modules/section/section.module';
import { DelegatedLegislationModule } from './modules/delegated-legislations/delegated-legislation/delegated-legislation.module';
import { LegislationGroupModule } from './modules/legislations/legislation-group/legislation-group.module';
import { DelegatedLegislationGroupModule } from './modules/delegated-legislations/delegated-legislation-group/delegated-legislation-group.module';
import { AmendmentModule } from './modules/amendment/amendment.module';
import { ChangeModule } from './modules/change/change.module';
import { ChangeValueModule } from './modules/change-value/change-value.module';
import { StashLegislationModule } from './modules/stash-legislation/stash-legislation.module';
import { StashSectionModule } from './modules/stash-section/stash-section.module';
import { StashDelegatedLegislationModule } from './modules/stash-delegated-legislation/stash-delegated-legislation.module';
import { PublicModule } from './modules/public/public.module';
import { ParentDocumentModule } from './modules/delegated-legislations/parent-document/parent-document.module';
import { DelegatedLegislationRelationshipModule } from './modules/delegated-legislations/delegated-legislation-relationship/delegated-legislation-relationship.module';
import { LegislationRelationshipModule } from './modules/legislations/legislation-relationship/legislation-relationship.module';
import { StatisticsModule } from './modules/stats/statistics/statistics.module';
import { ViewCountModule } from './modules/stats/view-count/view-count.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'storage', 'documentcopies'),
      serveRoot: '/storage/documentcopies',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'storage', 'annexures'),
      serveRoot: '/storage/annexures',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,

    LegislationGroupModule,
    DelegatedLegislationGroupModule,

    LegislationModule,
    DelegatedLegislationModule,

    SectionModule,
    DocumentCopyModule,
    AnnexureModule,
    AmendmentModule,
    ChangeModule,
    ChangeValueModule,
    StashLegislationModule,
    StashSectionModule,
    StashDelegatedLegislationModule,
    PublicModule,
    ParentDocumentModule,
    DelegatedLegislationRelationshipModule,
    LegislationRelationshipModule,
    StatisticsModule,
    ViewCountModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
