import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms";

//custom validator functie
export function uniqueDeviceTypeValidator():ValidatorFn{
  return (control:AbstractControl):ValidationErrors |null => {
    const formArray = control as FormArray;
    const deviceTypes = new Set();
    const duplicates = new Set();

    //Scan alle controls in de array om duplicaten te vinden
    formArray.controls.forEach((group)=>{
      const deviceType = group.get('deviceType')?.value;
      if(deviceType){
        if(deviceTypes.has(deviceType)){
          duplicates.add(deviceType);
        }
        deviceTypes.add(deviceType)
      }
    });

    // markeer de specifieke controls dat een duplicaat zijn
    formArray.controls.forEach((group)=>{
      const deviceTypeCtrl = group.get('deviceType');
      if(deviceTypeCtrl){
        if(duplicates.has(deviceTypeCtrl.value)){
          deviceTypeCtrl.setErrors({...deviceTypeCtrl.errors, duplicate:true});
        } else {
          //verwijder duplicate error als niet meer van toepassing
          if(deviceTypeCtrl.hasError('duplicate')){
            const errors = {...deviceTypeCtrl.errors};
            delete errors['duplicate'];
            deviceTypeCtrl.setErrors(Object.keys(errors).length ? errors : null);
          }
        }
      }
    });

    return duplicates.size > 0 ? {duplicateDeviceType:true}:null;

  };
}
