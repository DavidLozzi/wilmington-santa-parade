/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSantaLocation = /* GraphQL */ `
  query GetSantaLocation($id: ID!) {
    getSantaLocation(id: $id) {
      id
      lat
      lng
      date
      createdAt
      updatedAt
    }
  }
`;
export const listSantaLocations = /* GraphQL */ `
  query ListSantaLocations(
    $filter: ModelSantaLocationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSantaLocations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        lat
        lng
        date
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const santaLocationsByIdAndDate = /* GraphQL */ `
  query SantaLocationsByIdAndDate(
    $id: ID!
    $date: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSantaLocationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    santaLocationsByIdAndDate(
      id: $id
      date: $date
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        lat
        lng
        date
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
