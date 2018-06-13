 // Application state constants
  
export default {
  REGISTERING_AS_IN_STUDY: 'registering_as_in_study',
  REGISTERING_ELIGIBILITY: 'registering_eligibility',
  REGISTERING_NOT_ELIGIBLE: 'registering_not_eligible',
  REGISTERING_AS_ELIGIBLE: 'registering_as_eligible',
  REGISTERING_ACCEPT_TERMS: 'registering_accept_terms',
  REGISTERING_SIGNATURE: 'registering_signature',
  REGISTERING_IN_STUDY_STATES: ['registering_eligibility', 'registering_as_eligible', 'registering_accept_terms', 'registering_signature'],
  REGISTERING_AS_NO_STUDY: 'registering_as_no_study',
  REGISTERED_AS_IN_STUDY: 'registered_as_in_study',
  REGISTERED_AS_NO_STUDY: 'registered_as_no_study',
  REGISTRATION_COMPLETE: ['registered_as_in_study', 'registered_as_no_study'],
}