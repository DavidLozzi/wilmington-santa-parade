/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSantaLocation = /* GraphQL */ `
  query GetSantaLocation($id: ID!) {
    getSantaLocation(id: $id) {
      id
      lat
      lng
      date
      sort
      createdAt
      updatedAt
      __typename
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
        sort
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const byDate = /* GraphQL */ `
  query ByDate(
    $sort: String!
    $date: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSantaLocationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    byDate(
      sort: $sort
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
        sort
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
