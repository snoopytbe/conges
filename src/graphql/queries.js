/**
 * @fileoverview Requêtes GraphQL pour les congés
 * @module queries
 */

export const listConges = /* GraphQL */ `
  query ListConges(
    $filter: ModelCongeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConges(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        date
        type
        duree
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getConge = /* GraphQL */ `
  query GetConge($id: ID!) {
    getConge(id: $id) {
      id
      date
      type
      duree
      createdAt
      updatedAt
    }
  }
`; 