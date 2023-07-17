
import { 
  Form as VeeForm, 
  Field as VeeField, 
  defineRule, 
  ErrorMessage,
  configure,
} from "vee-validate";
import { 
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minValue,
  max_value as maxValue,
  confirmed,
  not_one_of as excluded,
} from "@vee-validate/rules";

export default {
  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule('required', required);
    defineRule('tos', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
    defineRule('min_value', minValue);
    defineRule('max_value', maxValue);
    defineRule('password_mismatch', confirmed);
    defineRule('excluded', excluded);
    defineRule('country_excluded', excluded);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `The field ${ctx.field} is required`,
          min: `The field ${ctx.field} is to shoort`,
          max: `The field ${ctx.field} is to long`,
          alpha_spaces: `The field ${ctx.field} may only contain alphabetic`,
          email: `The field ${ctx.field} must be a valid email`,
          min_value: `The field ${ctx.field} is to low`,
          max_value: `The field ${ctx.field} is to high`,
          excluded: `You are not allowed to use this value fo the field ${ctx.field}`,
          country_excluded: `We do not accept users from this location`,
          password_mismatch: `The passwords do not match`,
          tos: `You mist accept the Terms of Service`,
        };

        const message = messages[ctx.rule.name] 
          ? messages[ctx.rule.name]  
          : `The field ${ctx.field} is invalid`;

        return message;  
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false, 
      validateOnModelUpdate: true,
    });
  }
}