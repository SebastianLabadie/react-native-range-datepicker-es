"use strict";

import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import PropTypes from "prop-types";

import { Text, View, FlatList, StyleSheet, Button } from "react-native";

import Month from "./Month";

// import styles from './styles';

import { dayJsMod } from "../helper";

const RangeDatepicker = forwardRef((props, ref) => {
	const [startDate, setStartDate] = useState(props.startDate && dayJsMod(props.startDate, "YYYYMMDD"));

	const [untilDate, setUntilDate] = useState(props.untilDate && dayJsMod(props.untilDate, "YYYYMMDD"));

	const [availableDates, setAvailableDates] = useState(props.availableDates || null);

	useEffect(() => {
		setAvailableDates(props.availableDates);
	}, [props.availableDates]);

	const onSelectDate = (date) => {
		let tempStartDate = null;

		let tempUntilDate = null;

		// console.log('startDate', startDate);

		// console.log('untilDate', untilDate);

		if (startDate && !untilDate) {
			if (date.format("YYYYMMDD") < startDate.format("YYYYMMDD") || isInvalidRange(date)) {
				console.log(1);

				tempStartDate = date;
			} else if (date.format("YYYYMMDD") > startDate.format("YYYYMMDD")) {
				console.log(2);

				tempStartDate = startDate;

				tempUntilDate = date;
			} else {
				console.log(3);

				tempStartDate = null;

				tempUntilDate = null;
			}
		} else if (!isInvalidRange(date)) {
			console.log(4);

			tempStartDate = date;

			if (props.autoUntilDateDays > 0) {
				console.log("4.1");

				tempUntilDate = date.add(props.autoUntilDateDays - 1, "day");
			}
		} else {
			console.log(5);

			tempStartDate = null;

			tempUntilDate = null;
		}

		setStartDate(tempStartDate);

		setUntilDate(tempUntilDate);

		props.onSelect(tempStartDate, tempUntilDate);
	};

	const isInvalidRange = (date) => {
		if (availableDates && availableDates.length > 0) {
			//select endDate condition

			if (startDate && !untilDate) {
				for (
					let i = startDate.format("YYYYMMDD");
					i <= date.format("YYYYMMDD");
					i = dayJsMod(i, "YYYYMMDD").add(1, "days").format("YYYYMMDD")
				) {
					if (availableDates.indexOf(i) == -1 && startDate.format("YYYYMMDD") != i) return true;
				}
			}

			//select startDate condition
			else if (availableDates.indexOf(date.format("YYYYMMDD")) == -1) {
				return true;
			}
		}

		return false;
	};

	const getMonthStack = () => {
		let res = [];

		const { maxMonth, initialMonth, isHistorical } = props;

		let initMonth = dayJsMod();

		if (initialMonth && initialMonth != "") initMonth = dayJsMod(initialMonth, "YYYYMM");

		for (let i = 0; i < maxMonth; i++) {
			res.push(
				!isHistorical
					? initMonth.clone().add(i, "month").format("YYYYMM")
					: initMonth.clone().subtract(i, "month").format("YYYYMM")
			);
		}

		return res;
	};

	const onReset = () => {
		setStartDate(null);

		setUntilDate(null);

		props.onSelect(null, null);
	};

	const handleConfirmDate = () => {
		props.onConfirm && props.onConfirm(startDate, untilDate);
	};

	const handleRenderRow = (month, index) => {
		const { selectedBackgroundColor, selectedTextColor, todayColor, ignoreMinDate, minDate, maxDate } = props;

		if (availableDates && availableDates.length > 0) {
			availableDates = availableDates.filter(function (d) {
				if (d.indexOf(month) >= 0) return true;
			});
		}

		return (
			<Month
				onSelectDate={onSelectDate}
				titleStyle={{ textTransform: "uppercase", fontSize: 14, padding: 15, fontWeight: "700", letterSpacing: 1.5 }}
				startDate={startDate}
				untilDate={untilDate}
				availableDates={availableDates}
				minDate={minDate ? dayJsMod(minDate, "YYYYMMDD") : minDate}
				maxDate={maxDate ? dayJsMod(maxDate, "YYYYMMDD") : maxDate}
				ignoreMinDate={ignoreMinDate}
				dayProps={{ selectedBackgroundColor, selectedTextColor, todayColor }}
				month={month}
				capitalizeTitle={true}
			/>
		);
	};

	return (
		<View style={{ backgroundColor: "#F5F5F8", zIndex: 1000, alignSelf: "center", width: "100%", flex: 1 }}>
			{props.showClose || props.showReset ? (
				<View style={{ flexDirection: "row", justifyContent: "space-between", padding: 20, paddingBottom: 10 }}>
					{props.showClose && (
						<Text style={{ fontSize: 20 }} onPress={props.onClose}>
							Close
						</Text>
					)}

					{props.showReset && (
						<Text style={{ fontSize: 20 }} onPress={onReset}>
							Reset
						</Text>
					)}
				</View>
			) : null}

			{props.showSelectionInfo ? (
				<View
					style={{
						flexDirection: "row",
						borderWidth: 1.5,
						borderColor: "#eff0f4",
						justifyContent: "space-between",
						borderRadius: 6,
						paddingHorizontal: 20,
						paddingTop: 5,
						paddingBottom: 8,
						alignItems: "center",
						backgroundColor: "#fff",
					}}
				>
					<View style={{ flex: 1 }}>
						<Text
							style={{
								fontSize: 15,
								color: "#666",
								textTransform: "uppercase",
								fontWeight: "700",
								letterSpacing: 1.5,
							}}
						>
							{startDate ? dayJsMod(startDate).format("DD MMM YYYY") : props.placeHolderStart}
						</Text>
					</View>

					<View style={{}}>
						<Text style={{ fontSize: 30, color: "#002f87" }}>/</Text>
					</View>

					<View style={{ flex: 1 }}>
						<Text
							style={{
								fontSize: 15,
								color: "#666",
								textAlign: "right",
								textTransform: "uppercase",
								fontWeight: "700",
								letterSpacing: 1.5,
							}}
						>
							{untilDate ? dayJsMod(untilDate).format("DD MMM YYYY") : props.placeHolderUntil}
						</Text>
					</View>
				</View>
			) : null}

			{props.infoText != "" && (
				<View style={props.infoContainerStyle}>
					<Text style={props.infoStyle}>{props.infoText}</Text>
				</View>
			)}

			<View style={styles.dayHeader}>
				{props.dayHeadings.map((day, i) => {
					return (
						<Text style={{ width: "14.28%", textAlign: "center", color: "#c00c30", fontWeight: "500" }} key={i}>
							{day}
						</Text>
					);
				})}
			</View>

			<FlatList
				style={{ flex: 1 }}
				data={getMonthStack()}
				renderItem={({ item, index }) => {
					return handleRenderRow(item, index);
				}}
				initialScrollIndex={props.initialScrollIndex}
				getItemLayout={(data, index) => ({ length: 300, offset: 300 * index, index })}
				keyExtractor={(item, index) => index.toString()}
				showsVerticalScrollIndicator={false}
			/>

			{props.showButton ? (
				<View style={[styles.buttonWrapper, props.buttonContainerStyle]}>
					<Button title={props.buttonText} onPress={handleConfirmDate} color={props.buttonColor} />
				</View>
			) : null}
		</View>
	);
});

RangeDatepicker.propTypes = {
	initialMonth: PropTypes.string,

	initialScrollIndex: PropTypes.number,

	dayHeadings: PropTypes.arrayOf(PropTypes.string),

	availableDates: PropTypes.arrayOf(PropTypes.string),

	maxMonth: PropTypes.number,

	buttonColor: PropTypes.string,

	buttonContainerStyle: PropTypes.object,

	startDate: PropTypes.string,

	untilDate: PropTypes.string,

	minDate: PropTypes.string,

	maxDate: PropTypes.string,

	showReset: PropTypes.bool,

	showClose: PropTypes.bool,

	ignoreMinDate: PropTypes.bool,

	isHistorical: PropTypes.bool,

	onClose: PropTypes.func,

	onSelect: PropTypes.func,

	onConfirm: PropTypes.func,

	placeHolderStart: PropTypes.string,

	placeHolderUntil: PropTypes.string,

	selectedBackgroundColor: PropTypes.string,

	selectedTextColor: PropTypes.string,

	todayColor: PropTypes.string,

	infoText: PropTypes.string,

	infoStyle: PropTypes.object,

	infoContainerStyle: PropTypes.object,

	showSelectionInfo: PropTypes.bool,

	showButton: PropTypes.bool,

	buttonText: PropTypes.string,

	autoUntilDateDays: PropTypes.number,
};

RangeDatepicker.defaultProps = {
	buttonText: "Seleccionar",

	initialMonth: "",

	initialScrollIndex: 12,

	dayHeadings: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Do"],

	maxMonth: 12,

	buttonColor: "#333",

	buttonContainerStyle: {},

	showReset: true,

	showClose: true,

	ignoreMinDate: false,

	isHistorical: false,

	onClose: () => {},

	onSelect: () => {},

	onConfirm: () => {},

	placeHolderStart: "Desde",

	placeHolderUntil: "Hasta",

	selectedBackgroundColor: "green",

	selectedTextColor: "white",

	todayColor: "red",

	startDate: "",

	untilDate: "",

	minDate: "",

	maxDate: "",

	infoText: "",

	infoStyle: { color: "#fff", fontSize: 13 },

	infoContainerStyle: {
		marginRight: 20,
		paddingHorizontal: 20,
		paddingVertical: 5,
		backgroundColor: "green",
		borderRadius: 20,
		alignSelf: "flex-end",
	},

	showSelectionInfo: true,

	showButton: true,

	autoUntilDateDays: 0,
};

const styles = StyleSheet.create({
	dayHeader: {
		flexDirection: "row",

		paddingBottom: 10,

		paddingTop: 10,

		justifyContent: "center",

		alignItems: "center",

		marginHorizontal: -3,
	},

	buttonWrapper: {
		paddingVertical: 10,

		paddingHorizontal: 15,

		backgroundColor: "#002f87",

		borderRadius: 6,

		// borderTopWidth: 1,

		// borderColor: '#ccc',

		alignItems: "stretch",
	},
});

export default RangeDatepicker;
