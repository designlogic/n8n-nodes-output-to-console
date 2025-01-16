/* eslint-disable n8n-nodes-base/node-class-description-outputs-wrong */
/* eslint-disable n8n-nodes-base/node-class-description-inputs-wrong-regular-node */

import {
	INodeExecutionData,
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	AssignmentCollectionValue
} from 'n8n-workflow';

import { OutputUtilities, SetField } from './OutputUtilities';

export class OutputToConsole implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Output to Console',
		name: 'outputToConsole',
		icon: 'file:terminal.svg',
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
				name: 'textToOutput',
				type: 'json',
				default: '',
				description: 'The text to output to the browser console',
			},

			{
				displayName: 'Fields to Set',
				name: 'fields',
				placeholder: 'Add Field',
				type: 'fixedCollection',
				description: 'Edit existing fields or add new ones to modify the output data',
				typeOptions: {
					multipleValues: true,
					sortable: true,
				},
				default: {},
				options: [
					{
						name: 'values',
						displayName: 'Values',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								placeholder: 'e.g. fieldName',
								description:
									'Name of the field to set the value of. Supports dot-notation. Example: data.person[0].name.',
								requiresDataPath: 'single',
							},
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								description: 'The field value type',
								// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
								options: [
									{
										name: 'String',
										value: 'stringValue',
									},
									{
										name: 'Number',
										value: 'numberValue',
									},
									{
										name: 'Boolean',
										value: 'booleanValue',
									},
									{
										name: 'Array',
										value: 'arrayValue',
									},
									{
										name: 'Object',
										value: 'objectValue',
									},
								],
								default: 'stringValue',
							},
							{
								displayName: 'Value',
								name: 'stringValue',
								type: 'string',
								default: '',
								displayOptions: {
									show: {
										type: ['stringValue'],
									},
								},
								validateType: 'string',
								ignoreValidationDuringExecution: true,
							},
							{
								displayName: 'Value',
								name: 'numberValue',
								type: 'string',
								default: '',
								displayOptions: {
									show: {
										type: ['numberValue'],
									},
								},
								validateType: 'number',
								ignoreValidationDuringExecution: true,
							},
							{
								displayName: 'Value',
								name: 'booleanValue',
								type: 'options',
								default: 'true',
								options: [
									{
										name: 'True',
										value: 'true',
									},
									{
										name: 'False',
										value: 'false',
									},
								],
								displayOptions: {
									show: {
										type: ['booleanValue'],
									},
								},
								validateType: 'boolean',
								ignoreValidationDuringExecution: true,
							},
							{
								displayName: 'Value',
								name: 'arrayValue',
								type: 'string',
								default: '',
								placeholder: 'e.g. [ arrayItem1, arrayItem2, arrayItem3 ]',
								displayOptions: {
									show: {
										type: ['arrayValue'],
									},
								},
								validateType: 'array',
								ignoreValidationDuringExecution: true,
							},
							{
								displayName: 'Value',
								name: 'objectValue',
								type: 'json',
								default: '={}',
								typeOptions: {
									rows: 2,
								},
								displayOptions: {
									show: {
										type: ['objectValue'],
									},
								},
								validateType: 'object',
								ignoreValidationDuringExecution: true,
							},
						],
					},
				],
			},
			{
				displayName: 'Fields to Set',
				name: 'assignments',
				type: 'assignmentCollection',
				displayOptions: {
					hide: {
						'@version': [3, 3.1, 3.2],
					},
				},
				default: {},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const separator = '=====================';
		const outputHelper = new OutputUtilities();



		const assignmentCollection = this.getNodeParameter('assignments',	0,) as AssignmentCollectionValue;

		this.sendMessageToUI(`count ${assignmentCollection?.assignments?.length}`);

		(assignmentCollection?.assignments ?? []).forEach(item => {
			console.log("hello", item.name, item.value);

			this.sendMessageToUI(`>>>>>> Hi ${item.name} ${item.value}`);
	});






		for (let i = 0; i < items.length; i++) {
			const fields = this.getNodeParameter('fields.values', i, []) as SetField[];

			this.sendMessageToUI(`*********`);


			for (const field of fields) {
				let value;

				value = field.stringValue;
				this.sendMessageToUI(`Field: ${field.name}, Value: ${value}`);
			}

			this.sendMessageToUI(`*********`);

			let textToOutput = this.getNodeParameter('textToOutput', i);
			textToOutput = outputHelper.formatOutput(textToOutput);

			let message = `\n\n${separator}\n\n`;
			message += `${textToOutput}`;
			message += `\n\n${separator}\n\n`;

			this.sendMessageToUI(message);
		}

		return [this.helpers.returnJsonArray(items)];
	}
}
