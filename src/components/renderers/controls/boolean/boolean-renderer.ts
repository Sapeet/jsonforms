
import {Services} from "../../../services/services";
import {IRenderer} from "../../jsonforms-renderers";
import {RenderDescriptionFactory} from "../../jsonforms-renderers";
class BooleanRenderer implements IRenderer {

    priority = 2;

    render(element: IControlObject, subSchema: SchemaElement, schemaPath: string, services: Services) {
        var control = RenderDescriptionFactory.createControlDescription(schemaPath,  services, element);
        control['template'] = `<jsonforms-control>
          <input type="checkbox" id="${schemaPath}" class="jsf-control-boolean" ${element.readOnly ? 'disabled="disabled"' : ''} data-jsonforms-validation data-jsonforms-model/>
        </jsonforms-control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'boolean';
    }
}

export default angular
    .module('jsonforms.renderers.controls.boolean', ['jsonforms.renderers.controls'])
    .run(['RenderService', (RenderService) =>
        RenderService.register(new BooleanRenderer())
    ]).name;