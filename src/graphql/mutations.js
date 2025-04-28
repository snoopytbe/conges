/**
 * @fileoverview Mutations GraphQL pour les congés
 * @module mutations
 */

export const createConge = /* GraphQL */ `
  mutation CreateConge(
    $input: CreateCongeInput!
    $condition: ModelCongeConditionInput
  ) {
    createConge(input: $input, condition: $condition) {
      id
      date
      type
      duree
      createdAt
      updatedAt
    }
  }
`;

export const updateConge = /* GraphQL */ `
  mutation UpdateConge(
    $input: UpdateCongeInput!
    $condition: ModelCongeConditionInput
  ) {
    updateConge(input: $input, condition: $condition) {
      id
      date
      type
      duree
      createdAt
      updatedAt
    }
  }
`;

export const deleteConge = /* GraphQL */ `
  mutation DeleteConge(
    $input: DeleteCongeInput!
    $condition: ModelCongeConditionInput
  ) {
    deleteConge(input: $input, condition: $condition) {
      id
      date
      type
      duree
      createdAt
      updatedAt
    }
  }
`; 