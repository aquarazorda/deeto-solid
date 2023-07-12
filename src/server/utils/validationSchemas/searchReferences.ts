import * as zod from 'zod';
import { ContributionTypeEnum } from '~/server/enums/contributionType';
import { ReferenceStatusEnum } from '~/server/enums/referenceStatus';

export const searchReferencesRequestSchema = zod.object({
  freeText: zod.string().optional(),
  referenceStatus: zod.nativeEnum(ReferenceStatusEnum).optional(),
  assetTypes: zod.array(zod.nativeEnum(ContributionTypeEnum)).optional(),
  additionalFields: zod
    .array(
      zod.object({
        customizedFormFieldId: zod.string().uuid(),
        value: zod.array(zod.string()),
      }),
    )
    .optional(),
});