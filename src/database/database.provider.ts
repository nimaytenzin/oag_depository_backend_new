import { databaseConfig } from './database.config';

import { Sequelize } from 'sequelize-typescript';
import {
  DEVELOPMENT,
  PRODUCTION,
  SEQUELIZE,
  TEST,
} from 'src/constants/constants';
import { User } from 'src/modules/users/entities/user.entity';

import { DocumentCopy } from 'src/modules/storage/document-copy/entities/document-copy.entity';
import { Annexure } from 'src/modules/storage/annexure/entities/annexure.entity';
import { DelegatedLegislation } from 'src/modules/delegated-legislations/delegated-legislation/entities/delegated-legislation.entity';
import { LegislationGroup } from 'src/modules/legislations/legislation-group/entities/legislation-group.entity';
import { DelegatedLegislationGroup } from 'src/modules/delegated-legislations/delegated-legislation-group/entities/delegated-legislation-group.entity';
import { Legislation } from 'src/modules/legislations/legislation/entities/legislation.entity';
import { Section } from 'src/modules/section/entities/section.entity';
import { StashLegislation } from 'src/modules/stash-legislation/entities/stash-legislation.entity';
import { StashDelegatedLegislation } from 'src/modules/stash-delegated-legislation/entities/stash-delegated-legislation.entity';
import { StashSection } from 'src/modules/stash-section/entities/stash-section.entity';
import { Amendment } from 'src/modules/amendment/entities/amendment.entity';
import { Change } from 'src/modules/change/entities/change.entity';
import { ChangeValue } from 'src/modules/change-value/entities/change-value.entity';
import { ParentDocument } from 'src/modules/delegated-legislations/parent-document/entities/parent-document.entity';
import { DelegatedLegislationRelationship } from 'src/modules/delegated-legislations/delegated-legislation-relationship/entities/delegated-legislation-relationship.entity';
import { LegislationRelationship } from 'src/modules/legislations/legislation-relationship/entities/legislation-relationship.entity';
import { ViewCount } from 'src/modules/stats/view-count/entities/view-count.entity';
import { Feedback } from 'src/modules/feedback/entities/feedback.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      console.log('LOADING ENVIRONMENT VARIABLE');
      console.log(databaseConfig.development);
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([
        User,
        ViewCount,

        LegislationGroup,
        Legislation,
        LegislationRelationship,

        DelegatedLegislationGroup,
        DelegatedLegislation,
        DelegatedLegislationRelationship,
        ParentDocument,

        Section,

        Annexure,
        DocumentCopy,

        Amendment,
        Change,
        ChangeValue,

        StashLegislation,
        StashDelegatedLegislation,
        StashSection,
        Feedback,

        //new
      ]);

      await sequelize.sync();
      return sequelize;
    },
  },
];
