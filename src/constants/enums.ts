export enum USERROLES {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
}

export enum DelegatedLegislationType {
  RULESANDREGULATION = 'RULES AND REGULATION',
  GUIDELINES = 'GUIDELINES',
  CIRCULAR = 'CIRCULAR',
  NOTIFICATIONS = 'NOTIFICATIONS',
  OTHERS = 'OTHERS',
}

export enum LegislationType {
  ACT = 'ACT',
  CONVENTION = 'CONVENTION',
}

export enum LegislationStatus {
  BILL = 'BILL',
  ENACTED = 'ENACTED',
  REPEALED = 'REPEALED',
  AMENDED = 'AMENDED',
}

export enum DelegatedLegislationStatus {
  ENACTED = 'ENACTED',
  REVOKED = 'REVOKED',
  MODIFIED = 'MODIFIED',
}

export enum CommitType {
  INTERNAL = 'INTERNAL',
  ENACTMENT = 'ENACTMENT',
  AMENDMENT = 'AMENDMENT',
  REPEALED = 'REPEALED',
}

export enum AttachmentType {
  ENG = 'ENG',
  DZO = 'DZO',
  MISC = 'MISC',
}

export enum LanguageType {
  ENG = 'ENG',
  DZO = 'DZO',
  BI = 'BILINGUAL',
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  FINAL = 'PUBLISHED',
}

export enum DocumentType {
  LEGISLATION = 'LEGISLATION',
  DELEGATED_LEGISLATION = 'DELEGATED_LEGISLATION',
}

export const IgnoreAttributes: string[] = ['id', 'createdAt', 'updatedAt'];

export enum SectionChangeType {
  CREATION = 'CREATION',
  DELETION = 'DELETION',
  MODIFICATION = 'MODIFICATION',
  INSERTION = 'INSERTION',
}

export enum SectionType {
  HEADING_1 = 'HEADING_1',
  HEADING_2 = 'HEADING_2',
  HEADING_3 = 'HEADING_3',
  SUBSECTION_H1 = 'SUBSECTION_H1',
  SUBSECTION_H2 = 'SUBSECTION_H2',
  CLAUSE = 'CLAUSE',
}

export enum AnnexureType {
  ANNEXURE = 'ANNEXURE',
  NOTES = 'NOTES',
}

export enum ParentDocumentType {
  EXECUTIVE_ORDER = 'Executive Order',
  CIRCULAR = 'Circular',
  OFFICE_ORDER = 'Office Order',
}

export enum DelegatedLegislationRelationshipActions {
  REVOKES = 'Revokes',
  CONSOLIDATES = 'Consolidates',
}

export enum LegislationRelationshipActions {
  REPEALS = 'Repeals',
  AMENDS = 'Amends',
}
