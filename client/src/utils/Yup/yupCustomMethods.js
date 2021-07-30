
import * as Yup from "yup";

export const imageWidthHeightCheck = Yup.addMethod(Yup.mixed, 'imageWidthHeightCheck', function (message) {
    return this.test("image-width-height-check", message, async function (value) {
        const { path, createError } = this;

        if (!value) {
            return;
        }
    
        // await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(value);

        reader.onload = function() {
            console.log(reader.result);
          };
        // });
        
        return console.log('addMethod: ', value);
    });
});

