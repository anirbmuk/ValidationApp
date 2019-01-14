define(['ojs/ojcore', 'knockout', 'ojs/ojknockout', 'ojs/ojlabel',
    'ojs/ojinputtext', 'ojs/ojdatetimepicker', 'ojs/ojbutton', 'ojs/ojvalidationgroup',
    'ojs/ojvalidation-datetime'],
        function (oj, ko) {
            function ControllerViewModel() {
                var self = this;

                var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
                self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

                self.appName = ko.observable("Validation App");
                self.userLogin = ko.observable("anirban.m.mukherjee@oracle.com");
                
                self.validators = {
                    ojInputText: [
                        [{
                            type: 'length',
                            options: {
                                min: 5,
                                max: 30,
                                messageSummary: {
                                    tooLong: 'Maximum {max} characters allowed',
                                    tooShort: 'Minimum {min} characters required'
                                },
                                messageDetail: {
                                    tooLong: 'Number of characters is too high. Enter at most {max} characters',
                                    tooShort: 'Number of characters is too low. Enter at least {min} characters.'}
                            }
                        }],
                        [{
                            type: 'length',
                            options: {
                                min: 0,
                                max: 10,
                                messageSummary: {
                                    tooLong: 'Maximum {max} characters allowed',
                                    tooShort: 'Minimum {min} characters required'
                                },
                                messageDetail: {
                                    tooLong: 'Number of characters is too high. Enter at most {max} characters',
                                    tooShort: 'Number of characters is too low. Enter at least {min} characters.'}
                            }
                        }
                    ]],
                    ojInputDate: [
                        {
                            type: 'dateTimeRange',
                            options: {
                                max: oj.IntlConverterUtils.dateToLocalIso(new Date()),
                                min: oj.IntlConverterUtils.dateToLocalIso(new Date(2010, 00, 01)),
                                hint: {
                                    'inRange': 'Enter a date that falls in the current decade'
                                }
                            }
                        }
                    ]
                };

                self.coreValidateFn = function () {
                    const items = self.coreGroupTemplate.value.groups;
                    let allValid = true;
                    items.some(component => {
                        const str = $(`#${component.id}`);
                        const uic = str[0];
                        if (uic) {
                            const tagName = uic.tagName;
                            if (!tagName.startsWith('OJ-')) {
                                if (component.component === 'ojInputText') {
                                    if (!(str).ojInputText("option", "value")) {
                                        (str).ojInputText("showMessages");
                                    } else {
                                        (str).ojInputText("validate");
                                    }
                                    allValid = str.ojInputText("isValid");
                                } else if (component.component === 'ojInputDate') {
                                    if (!(str).ojInputDate("option", "value")) {
                                        (str).ojInputDate("showMessages");
                                    } else {
                                        (str).ojInputDate("validate");
                                    }
                                    allValid = str.ojInputDate("isValid");
                                }
                            }
                            if (!allValid) {
                                uic.focus();
                                return true;
                            }
                        }
                    });
                    if (allValid) {
                        console.log('all named fields validated');
                    }
                };

                self.namedValidateFn = function () {
                    const items = self.namedGroupTemplate.value.groups;
                    let allValid = true;
                    items.some(component => {
                        const str = $(`#${component.id}`);
                        const uic = str[0];
                        if (uic) {
                            const tagName = uic.tagName;
                            if (tagName.startsWith('OJ-')) {
                                if (component.isRequired && !uic.value) {
                                    uic.showMessages();
                                    uic.focus();
                                } else {
                                    uic.validate();
                                }
                            } else {
                                if (component.component === 'ojInputText') {
                                    if (!(str).ojInputText("option", "value")) {
                                        (str).ojInputText("showMessages");
                                    } else {
                                        (str).ojInputText("validate");
                                    }
                                } else if (component.component === 'ojInputDate') {
                                    if (!(str).ojInputDate("option", "value")) {
                                        (str).ojInputDate("showMessages");
                                    } else {
                                        (str).ojInputDate("validate");
                                    }
                                }
                            }
                            if (uic.valid !== 'valid') {
                                uic.focus();
                                allValid = false;
                                return true;
                            }
                        }
                    });
                    if (allValid) {
                        console.log('all named fields validated');
                    }
                };

                self.novalidateFn = function () {
                    console.log('novalidate');
                };

                self.coreDataTemplate = {
                    name: 'demo-template',
                    value: {
                        components: [
                            {
                                component: 'ojButton',
                                id: 'btn1',
                                label: 'Save',
                                cssClass: 'oj-button oj-button-confirm',
                                clickAction: self.coreValidateFn
                            },
                            {
                                component: 'ojButton',
                                id: 'btn2',
                                label: 'Cancel',
                                cssClass: 'oj-button oj-button-primary',
                                clickAction: self.novalidateFn
                            }
                        ]
                    }
                };

                self.namedDataTemplate = {
                    name: 'demo-template',
                    value: {
                        components: [
                            {
                                component: 'ojButton',
                                id: 'btn3',
                                label: 'Save',
                                cssClass: 'oj-button oj-button-confirm',
                                clickAction: self.namedValidateFn
                            },
                            {
                                component: 'ojButton',
                                id: 'btn4',
                                label: 'Cancel',
                                cssClass: 'oj-button oj-button-primary',
                                clickAction: self.novalidateFn
                            }
                        ]
                    }
                };

                self.coreGroupTemplate = {
                    name: 'core-group-template',
                    value: {
                        header: 'Old style JET components',
                        groups: [
                            {
                                component: 'ojInputText',
                                id: 'oinput1',
                                label: 'Core First Name',
                                inputValue: '',
                                isRequired: true,
                                visible: true,
                                validators: self.validators.ojInputText[0]
                            },
                            {
                                component: 'ojInputText',
                                id: 'oinput2',
                                label: 'Core Last Name',
                                inputValue: '',
                                isRequired: false,
                                visible: true,
                                validators: []
                            },
                            {
                                component: 'ojInputDate',
                                visible: true,
                                id: 'oinput3',
                                label: 'Core Date Field',
                                inputValue: '',
                                isRequired: true,
                                validators: self.validators.ojInputDate
                            }
                        ]
                    }
                };

                self.namedGroupTemplate = {
                    name: 'named-group-template',
                    value: {
                        header: 'New JET web components',
                        groups: [
                            {
                                component: 'ojInputText',
                                visible: true,
                                id: 'ninput1',
                                label: 'Web First Name',
                                inputValue: '',
                                isRequired: true,
                                validators: self.validators.ojInputText[1]
                            },
                            {
                                component: 'ojInputText',
                                visible: true,
                                id: 'ninput2',
                                label: 'Web Last Name',
                                inputValue: '',
                                isRequired: false,
                                validators: []
                            },
                            {
                                component: 'ojInputDate',
                                visible: true,
                                id: 'ninput3',
                                label: 'Web Date Field',
                                inputValue: '',
                                isRequired: true,
                                validators: self.validators.ojInputDate
                            }
                        ]
                    }
                };
            }
            return new ControllerViewModel();
        }
);
