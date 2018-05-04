/**
 * Created by XPL on 2018/3/24.
 */
import VeeValidate, { Validator } from 'vee-validate';
import zh from 'vee-validate/dist/locale/zh_CN';
import { validateRules, validateAttributes, validateCustom } from './vaildateConfig';

const Veeconfig = {
    locale: 'zh_CN',
    events: 'input'
};
Validator.localize('zh_CN', zh);

Object.keys(validateRules).forEach((key) => {
    validateRules[key].validate && Validator.extend(key, validateRules[key].validate);
    // merge the validator messages
    Object.keys(validateRules[key].messages).forEach(locale => {

        Validator.localize({
            [locale]: {
                messages: {
                    [key]: validateRules[key].messages[locale]
                }
            }
        });
    });
});

Object.keys(validateAttributes).forEach((key) => {
    Validator.localize({
        [key]: {
            attributes: validateAttributes[key]
        }
    });
});

Object.keys(validateCustom).forEach((key) => {
    Validator.localize({
        [key]: {
            custom: validateCustom[key]
        }
    });
});

export { VeeValidate, Veeconfig };


// Validator.addLocale(zh);

// var zhReset = Object.assign({}, zh, {
//     messages: {
//         required: (field) => '请输入' + field,
//         confirmed: () => '两次密码输入不一致'
//     },
//     attributes: {
//         email: '邮箱',
//         password: '密码',
//         phone: '手机号',
//         nickname: '昵称',
//         confirmPW: '密码',
//         verifycode: '验证码'
//     }
// });



// const dictionary = {
//     zh_CN: {
//         messages: {
//             required: (field) => '请输入' + field,
//             confirmed: () => '两次密码输入不一致'
//         },
//         attributes: {
//             email: '邮箱',
//             password: '密码',
//             phone: '手机号',
//             nickname: '昵称',
//             confirmPW: '密码',
//             verifycode: '验证码'
//         }
//     }
// };
// for (var key in verifyMsg){
//   (function(key){
//     var val = verifyMsg[key];
//     var reg = new RegExp(val.pattern);
//     var rules = {
//       getMessage: (field, args) => {
//         return field + val.verifyMsg;
//       },
//       messages: {
//         zh_CN: (field, args) => {
//           return field + val.verifyMsg;
//         }
//       },
//       validate: (value, args) => {
//         return reg.test(value);
//       }
//     }
//     Validator.extend(key, rules);
//   })(key);
//
// }

// const isPW = {
//   getMessage: (field, args) => {
//     return field + '必须是6到16位，字母、数字或者二者混合';
//   },
//   messages: {
//     zh_CN: (field, args) => {
//       return field + '必须是6到16位，字母、数字或者二者混合';
//     }
//   },
//   validate: (value, args) => {
//     return /^[0-9a-zA-Z~!@#$%^&*()<>?{}+*/|-]{6,18}$/.test(value);
//   }
// };
// Validator.extend('pw', isPW);

// Validator.localize('zh_CN', dictionary);
// Validator.updateDictionary(dictionary);


