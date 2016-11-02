(function () {
    'use strict';

    angular.module('shiptApp').factory('Registration', [Register]);

    function Register() {

        /**
         * Represents the mapping of a registration object to the API.
         */
        class RegisterEntity {
            constructor(data) {
                this.email = data.email;
                this.name = data.name;
                this.password = data.password;
                this.phone = data.phone;
                this.zip_code = data.zip.toString();
            }
        }

        return {
            build: buildRegistrationEntity,
            validate: getValidationErrors
        };

        /**
         * @ngdoc function
         * @name buildRegistrationEntity
         * @description Builds a UI registration object to be persisted through the API.
         *
         * @param registerData The registration data.
         * @returns {RegisterEntity} The registration object ready for persistence.
         */
        function buildRegistrationEntity(registerData) {
            return new RegisterEntity(registerData);
        }

        /**
         * @ngdoc function
         * @name getValidationErrors
         * @description Validates registration data.
         *
         * @param registerData The registration data to validate.
         * @returns {Array} The list of validation errors. Empty if none.
         */
        function getValidationErrors(registerData) {
            var validationErrors = [];

            // Validate password
            var passwordMinLength = 6;
            if (registerData.password.length < passwordMinLength) {
                validationErrors.push(`Password must be at least ${passwordMinLength} characters long.`);
            }

            // Validates zip code
            if (!registerData.zip || !Number(registerData.zip)) {
                validationErrors.push('Please enter a valid zip code.');
            }

            return validationErrors;
        }

    }

})();
