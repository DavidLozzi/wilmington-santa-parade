/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSantaLocation = /* GraphQL */ `
  mutation CreateSantaLocation(
    $input: CreateSantaLocationInput!
    $condition: ModelSantaLocationConditionInput
  ) {
    createSantaLocation(input: $input, condition: $condition) {
      id
      lat
      lng
      date
      createdAt
      updatedAt
    }
  }
`;
export const updateSantaLocation = /* GraphQL */ `
  mutation UpdateSantaLocation(
    $input: UpdateSantaLocationInput!
    $condition: ModelSantaLocationConditionInput
  ) {
    updateSantaLocation(input: $input, condition: $condition) {
      id
      lat
      lng
      date
      createdAt
      updatedAt
    }
  }
`;
export const deleteSantaLocation = /* GraphQL */ `
  mutation DeleteSantaLocation(
    $input: DeleteSantaLocationInput!
    $condition: ModelSantaLocationConditionInput
  ) {
    deleteSantaLocation(input: $input, condition: $condition) {
      id
      lat
      lng
      date
      createdAt
      updatedAt
    }
  }
`;
