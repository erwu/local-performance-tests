
export const GET_RATES_COUNT = `
  query GetRatesCountQuery($rateParams: RateParams!) {
    propertiesWithCount: properties(rateParams: $rateParams) {
      categories {
        value
        count
      }
      hotelRatings {
        value
        count
      }
      ratesCount
    }
  }
`;
