type UnknownRecord = Record<string, unknown>;

function withAlias<T extends UnknownRecord, K extends string, V>(
  target: T,
  key: K,
  value: V,
): T & Record<K, V> {
  return {
    ...target,
    [key]: value,
  } as T & Record<K, V>;
}

export function normalizeUserFields<T extends UnknownRecord>(entity: T) {
  const result = { ...entity };

  if ('user_type' in entity && !('userType' in entity)) {
    return withAlias(result, 'userType', entity.user_type);
  }

  return result;
}

export function normalizeNameFields<T extends UnknownRecord>(entity: T) {
  let result = { ...entity };

  if ('first_name' in entity && !('firstName' in entity)) {
    result = withAlias(result, 'firstName', entity.first_name);
  }

  if ('last_name' in entity && !('lastName' in entity)) {
    result = withAlias(result, 'lastName', entity.last_name);
  }

  if ('middle_name' in entity && !('middleName' in entity)) {
    result = withAlias(result, 'middleName', entity.middle_name);
  }

  if ('birth_date' in entity && !('birthDate' in entity)) {
    result = withAlias(result, 'birthDate', entity.birth_date);
  }

  if ('certificate_number' in entity && !('certificateNumber' in entity)) {
    result = withAlias(result, 'certificateNumber', entity.certificate_number);
  }

  return result;
}

export function normalizeMetricFields<T extends UnknownRecord>(entity: T) {
  let result = { ...entity };

  const mappings: Array<[string, string]> = [
    ['waist_circumference', 'waistCircumference'],
    ['chest_circumference', 'chestCircumference'],
    ['hip_circumference', 'hipCircumference'],
    ['arm_circumference', 'armCircumference'],
    ['leg_circumference', 'legCircumference'],
    ['fitness_goal', 'fitnessGoal'],
    ['expected_result', 'expectedResult'],
    ['training_experience', 'trainingExperience'],
    ['current_diet', 'currentDiet'],
    ['body_fat', 'bodyFat'],
    ['muscle_mass', 'muscleMass'],
  ];

  for (const [legacyKey, camelKey] of mappings) {
    if (legacyKey in entity && !(camelKey in entity)) {
      result = withAlias(result, camelKey, entity[legacyKey]);
    }
  }

  return result;
}

export function normalizePhotoFields<T extends UnknownRecord>(entity: T) {
  const result = { ...entity };

  if ('photo_urls' in entity && !('photoUrls' in entity)) {
    return withAlias(result, 'photoUrls', entity.photo_urls);
  }

  return result;
}

export function normalizeTimestampFields<T extends UnknownRecord>(entity: T) {
  let result = { ...entity };

  if ('created_at' in entity && !('createdAt' in entity)) {
    result = withAlias(result, 'createdAt', entity.created_at);
  }

  if ('updated_at' in entity && !('updatedAt' in entity)) {
    result = withAlias(result, 'updatedAt', entity.updated_at);
  }

  return result;
}

export function normalizeTrainer<T extends UnknownRecord>(trainer: T) {
  return normalizeTimestampFields(
    normalizePhotoFields(normalizeNameFields(trainer)),
  );
}

export function normalizeClient<T extends UnknownRecord>(client: T) {
  const normalized = normalizeMetricFields(
    normalizePhotoFields(normalizeNameFields(client)),
  );

  if ('trainer' in normalized && normalized.trainer && typeof normalized.trainer === 'object') {
    return {
      ...normalized,
      trainer: normalizeTrainer(normalized.trainer as UnknownRecord),
    };
  }

  return normalized;
}

export function normalizeAuthUser<T extends UnknownRecord>(user: T) {
  const normalized = normalizeUserFields(normalizeClient(user));

  if ('trainer' in normalized && normalized.trainer && typeof normalized.trainer === 'object') {
    return {
      ...normalized,
      trainer: normalizeTrainer(normalized.trainer as UnknownRecord),
    };
  }

  return normalized;
}

export function normalizeChatUser<T extends UnknownRecord>(user: T) {
  return normalizePhotoFields(user);
}
