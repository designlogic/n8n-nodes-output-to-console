/* eslint-disable n8n-nodes-base/node-class-description-outputs-wrong */
/* eslint-disable n8n-nodes-base/node-class-description-inputs-wrong-regular-node */

import {
	INodeExecutionData,
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	AssignmentCollectionValue,
} from 'n8n-workflow';

import { OutputUtilities } from './OutputUtilities';

export class OutputToConsole implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Output to Console',
		name: 'outputToConsole',
		icon: {
			light: 'file:terminal-light.svg',
			dark: 'file:terminal-dark.svg',
		},
		group: ['transform'],
		version: 1,
		description: 'Outputs data to the browser console',
		defaults: {
			name: 'Output To Console',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Text To Output',
				name: 'assignments',
				type: 'assignmentCollection',
				description: 'The text to output to the browser console',
				default: {},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
			const items = this.getInputData();

			try{
			let textToOutput = '';

			for (let i = 0; i < items.length; i++) {
				const outputHelper = new OutputUtilities();
				const assignmentCollection = this.getNodeParameter('assignments',i,) as AssignmentCollectionValue;
				const assignments = assignmentCollection?.assignments ?? [];
				const outputTemplate = (items.length > 1 ) ?  outputHelper.multiItemTemplate : outputHelper.singleItemTemplate;

				assignments
				.filter((assignment) => {
					return outputHelper.hasValue(assignment.value);
				})
				.forEach((assignment) => {
					const formattedOutput = outputHelper.formatOutput(assignment.value, assignment.name);
					outputHelper.appendLine(formattedOutput);
				});

				textToOutput += outputTemplate(outputHelper.messages.join(`\n-------------------------------------------------\n\n`).trimEnd(), i + 1);
			}

			this.sendMessageToUI(textToOutput);

		}
		catch(error){
			this.sendMessageToUI(`Error: ${(error as Error).message}`);
		}

		return [this.helpers.returnJsonArray(items)];
	}
}
