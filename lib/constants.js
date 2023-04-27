const { collection } = require("firebase/firestore");

let CONSTANTS = {

    TABLES: {

        MASTER: `permissions_master`,
        USER_MAPPING: 'user_mapping',
    },
    collection:{
        categories:'Category',
        program:'programs',
        cohort:'cohorts',
        instructors:'Instructors',
        faq:'faq',
        cohort_benefit:'cohort_benefits',
        organization:'organization',
        Program_benefits:'Program_benefits',
        sponsorship:'sponsorship',
        USER_MAPPING: 'user_mapping',
        OTP: 'one_time_password',
        zoho_tokens:'zoho_tokens',
        lead_status:'lead_status',
    }

}

module.exports = Object.freeze(CONSTANTS);