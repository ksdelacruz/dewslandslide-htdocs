var data_timestamp;
var latest_release_id;
function sendViaAlertMonitor(dashboard_data){
	if (window.location.href == window.location.origin+"/communications/chatterbox_beta") {
		var internal_alert = "";
		var backbone_message = "";
		var recommended_response = "";
		var alertLevel = dashboard_data.alert_level;
		if (alertLevel.length == 2 && alertLevel.indexOf("A") != -1) {
			alertLevel = alertLevel.replace("A","Alert ");
		}

		if (dashboard_data.internal_alert != "N/A") {
			$.ajax({
				type: "POST",
				url: "../communications/getkeyinputviatriggertype",
				async: false,
				data: {trigger_type : dashboard_data.internal_alert},
				success: function(response){
					internal_alert = JSON.parse(response);
				}
			});
		}

		if (dashboard_data.alert_status != "N/A") {
			$.ajax({
				type: "POST",
				url: "../communications/getbackboneviastatus",
				async: false,
				data: {alert_status : dashboard_data.alert_status},
				success: function(response){
					backbone_message = JSON.parse(response);
				}
			});
		}

		if (alertLevel != "N/A") {
			$.ajax({
				type: "POST",
				url: "../communications/getrecommendedresponse",
				async: false,
				data: {recommended_response : alertLevel},
				success: function(response){
					recommended_response = JSON.parse(response);
					for (var counter = 0; counter < recommended_response.length; counter++) {
						if (recommended_response[counter].alert_status == dashboard_data.alert_status) {
							recommended_response = recommended_response[counter];
						}
					}
				}
			});
		}

		var final_template = backbone_message[0].template;

		var d = new Date();
		var current_meridiem = d.getHours();

		if (current_meridiem >= 13 && current_meridiem <= 18) {
			final_template = final_template.replace("(greetings)","hapon");
		} else if (current_meridiem >= 18 && current_meridiem <=23) {
			final_template = final_template.replace("(greetings)","gabi");
		} else if (current_meridiem >= 0 && current_meridiem <= 3) {
			final_template = final_template.replace("(greetings)","gabi");
		} else if (current_meridiem >= 4 && current_meridiem <= 11) {
			final_template = final_template.replace("(greetings)","umaga");
		} else {
			final_template = final_template.replace("(greetings)","tanghali");
		}

		final_template = final_template.replace("(alert_level)",dashboard_data.alert_level);
		var ewiLocation = dashboard_data["sitio"]+", "+dashboard_data["barangay"]+", "+dashboard_data["municipality"]+", "+dashboard_data["province"];
		var formatSbmp = ewiLocation.replace("null","");
		if (formatSbmp.charAt(0) == ",") {
			formatSbmp = formatSbmp.substr(1);
		}

		final_template = final_template.replace("(site_location)",formatSbmp);
		final_template = final_template.replace("(recommended_response)",recommended_response.key_input);
		final_template = final_template.replace("(technical_info)",internal_alert.key_input);

		var currentTime = moment().format("YYYY-MM-DD HH:mm");
		if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 00:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 04:00").valueOf()) {
			final_template = final_template.replace("(gndmeas_time_submission)","bago mag-07:30 AM");
			final_template = final_template.replace("(gndmeas_date_submission)","mamaya");

			final_template = final_template.replace("(next_ewi_time)","04:00 AM");
			final_template = final_template.replace("(next_ewi_date)","mamayang");
		} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 04:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 08:00").valueOf()) {
			final_template = final_template.replace("(gndmeas_time_submission)","bago mag-07:30 AM");
			final_template = final_template.replace("(gndmeas_date_submission)","mamaya");

			final_template = final_template.replace("(next_ewi_time)","08:00 AM");
			final_template = final_template.replace("(next_ewi_date)","mamayang");
		} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 08:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 12:00").valueOf()) {
			final_template = final_template.replace("(gndmeas_time_submission)","bago mag-11:30 AM");
			final_template = final_template.replace("(gndmeas_date_submission)","mamaya");

			final_template = final_template.replace("(next_ewi_time)","12:00 NN");
			final_template = final_template.replace("(next_ewi_date)","mamayang");
		} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 12:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 16:00").valueOf()) {
			final_template = final_template.replace("(gndmeas_time_submission)","bago mag-3:30 PM");
			final_template = final_template.replace("(gndmeas_date_submission)","mamaya");

			final_template = final_template.replace("(next_ewi_time)","04:00 PM");
			final_template = final_template.replace("(next_ewi_date)","mamayang");
		} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 16:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 20:00").valueOf()) {
			final_template = final_template.replace("(gndmeas_time_submission)","bago mag-7:30 AM");
			final_template = final_template.replace("(gndmeas_date_submission)","bukas");

			final_template = final_template.replace("(next_ewi_time)","08:00 PM");
			final_template = final_template.replace("(next_ewi_date)","mamayang");
		} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 20:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').add(24, "hours").format("YYYY-MM-DD")+" 00:00").valueOf()) {
			final_template = final_template.replace("(gndmeas_time_submission)","bago mag-7:30 AM");
			final_template = final_template.replace("(gndmeas_date_submission)","bukas");

			final_template = final_template.replace("(next_ewi_time)","12:00 MN");
			final_template = final_template.replace("(next_ewi_date)","bukas ng");
		} else {
			alert("Error Occured: Please contact Administrator");
		}

		final_template = final_template.replace("(current_date)",moment(dashboard_data.data_timestamp).format('LL'));
		$('#msg').val(final_template);
		$('#site-abbr').val(dashboard_data["name"]);
	} else {
		var alert_site_name = "";
		var alert_level = "";
		
		// HOTFIX OF ND sites
		if (dashboard_data.internal_alert_level.indexOf('ND-R') > -1 || dashboard_data.internal_alert_level.indexOf('ND') > -1) {
			dashboard_data.internal_alert_level = "A1-R";
		} else if (dashboard_data.internal_alert_level.indexOf('ND-E') > -1) {
			dashboard_data.internal_alert_level = "A1-E";
		} else if (dashboard_data.internal_alert_level.indexOf('A1-Rx') > -1) {
			dashboard_data.internal_alert_level = "A1-R";
		}

		if (dashboard_data.name == "msu" || dashboard_data.name == "msl") {
			alert_site_name = "mes";
		} else {
			alert_site_name = dashboard_data.name;
		}
		alert_level = dashboard_data.internal_alert_level.split('-')[0];
		if (alert_level.length == 2) {
			alert_level = "Alert "+alert_level[1];
		}

		$.ajax({
			type: "POST",
			url: "../chatterbox/getCommunityContactViaDashboard/",
			async: true,
			data: {site: alert_site_name},
			success: function(response){

				var contacts = JSON.parse(response);
				var default_recipients = [];
				var additional_recipients = [];

				$('#ewi-recipients-dashboard').tagsinput('removeAll');
				$('#ewi-recipients-dashboard').val('');

				for (var counter = 0; counter < contacts.length; counter++) {
					var numbers = contacts[counter].number.split(',');
					var number = "";
					var temp = "";

					if (contacts[counter].ewirecipient != 0) {
						numbers.forEach(function(x) {
							temp = temp+"|"+x;
							number = temp;
						});
						if (dashboard_data.status == "extended") {
							if (contacts[counter].office != "PLGU" && contacts[counter].office != "GDAPD-PHIV" && contacts[counter].office != "REG8") {
								var detailed = contacts[counter].office+" : "+contacts[counter].lastname+" "+contacts[counter].firstname+" "+number;
								default_recipients.push(detailed);
								$('#ewi-recipients-dashboard').tagsinput('add',detailed);
							}
						} else {
							if (contacts[counter].office != "GDAPD-PHIV") {
								var detailed = contacts[counter].office+" : "+contacts[counter].lastname+" "+contacts[counter].firstname+" "+number;
								default_recipients.push(detailed);
								$('#ewi-recipients-dashboard').tagsinput('add',detailed);
							}
						}
					} else {
						numbers.forEach(function(x) {
							temp = temp+"|"+x;
							number = temp;
						});
						var detailed = contacts[counter].office+" : "+contacts[counter].lastname+" "+contacts[counter].firstname+" "+number;
						additional_recipients.push(detailed);
					}
				}
				$('#default-recipients').val(default_recipients);
				$('#additional-recipients').val(additional_recipients);
			}
		});

		$('#constructed-ewi-amd').prop("disabled", true );
		$("#edit-btn-ewi-amd").attr('class', 'btn btn-warning');
		$('#edit-btn-ewi-amd').text("Edit");
		$('#edit-btn-ewi-amd').val("edit");
		$('#event_details').val(JSON.stringify(dashboard_data));
		var alertLevel = dashboard_data.internal_alert_level.split('-')[0];
		var alertTrigger = dashboard_data.internal_alert_level.split('-')[1];
		$.ajax({
			type: "POST",
			url: "../communications/getkeyinputviatriggertype",
			async: true,
			data: {trigger_type:alertTrigger},
			success: function(data) {
				if (data != null) {
					var techInfo = JSON.parse(data);
				}
				$.ajax({
					type: "POST",
					url: "../communications/getbackboneviastatus",
					async: true,
					data: {alert_status: techInfo.alertLevel},
					success: function(data) {
						var backboneMessage = JSON.parse(data);
						if (alertLevel.length == 2 && alertLevel.indexOf("A") != -1) {
							alertLevel = alertLevel.replace("A","Alert ");
						}
						$.ajax({
							type: "POST",
							url: "../communications/getrecommendedresponse",
							async: true,
							data: {recommended_response: alertLevel},
							success: function(data) {
								var recommendedResponse = JSON.parse(data);
								var template = "";
								var level;
								if (recommendedResponse[0].alert_symbol_level.match(/\d+/g)) {
									level = recommendedResponse[0].alert_symbol_level[recommendedResponse[0].alert_symbol_level.length-1];
								}
								for (var counter = 0;counter < backboneMessage.length; counter++) {
									if (backboneMessage[counter].alert_status.indexOf(level) == -1 && level == 3) {
										template = backboneMessage[counter].template;
									} else {
										if (level == 1 || level == 2) {
											if (backboneMessage[counter].alert_status == "Event") {
												template = backboneMessage[counter].template;
											}
										} else {
											template = backboneMessage[counter].template;
											break;
										}
									}
								}
								for (var counter = 0;counter < backboneMessage.length;counter++) {
									if (backboneMessage[counter].alert_status.toLowerCase() == dashboard_data.status) {
										template = backboneMessage[counter].template;
										switch(dashboard_data.day) {
											case 0:
											template = template.replace('(nth-day-extended)','tatlong');
											break;
											case 1:
											template = template.replace('(nth-day-extended)','unang');
											break;
											case 2:
											template = template.replace('(nth-day-extended)','pangalawang');
											break;
											case 3:
											template = template.replace('(nth-day-extended)','Ikatlong');
											break;
										}
									}
								}

								var d = new Date();
								var current_meridiem = d.getHours();

								if (current_meridiem >= 13 && current_meridiem <= 18) {
									template = template.replace("(greetings)","hapon");
								} else if (current_meridiem >= 18 && current_meridiem <=23) {
									template = template.replace("(greetings)","gabi");
								} else if (current_meridiem >= 0 && current_meridiem <= 3) {
									template = template.replace("(greetings)","gabi");
								} else if (current_meridiem >= 4 && current_meridiem <= 11) {
									template = template.replace("(greetings)","umaga");
								} else {
									template = template.replace("(greetings)","tanghali");
								}

								template = template.replace("(alert_level)",alert_level);
								var ewiLocation = dashboard_data["sitio"]+", "+dashboard_data["barangay"]+", "+dashboard_data["municipality"]+", "+dashboard_data["province"];
								var formatSbmp = ewiLocation.replace("null","");
								if (formatSbmp.charAt(0) == ",") {
									formatSbmp = formatSbmp.substr(1);
								}

								template = template.replace("(site_location)",formatSbmp);
								if (techInfo.key_input.substring(0,4) == " at ") {
									techInfo.key_input = techInfo.key_input.substring(4);
								}

								template = template.replace("(technical_info)",techInfo.key_input);
								template = template.replace("(recommended_response)",recommendedResponse[0].key_input);

								var currentTime = moment().format("YYYY-MM-DD HH:mm");

								var release_time = moment(dashboard_data.data_timestamp).format("YYYY-MM-DD hh:mm A");
								var onset_time = moment(dashboard_data.event_start).format("YYYY-MM-DD hh:mm A");

								data_timestamp = dashboard_data.data_timestamp;
								latest_release_id = dashboard_data.latest_release_id;

								if (onset_time != release_time) {
									var meridiem = moment(dashboard_data.data_timestamp).add(30,'m').format("hh:mm A");
									if (meridiem == "12:00 AM") {
										meridiem = meridiem.replace("AM","MN");
									} else if (meridiem == "12:00 PM") {
										meridiem = meridiem.replace("PM","NN");
									}

									var current_time = moment().format('LL');
									template = template.replace("(current_date_time)",current_time+" "+meridiem);
									template = template.replace("(current_date)",moment().format("MMMM D, YYYY"));
								} else {
									var meridiem = moment(dashboard_data.event_start).format("hh:mm A");
									if (meridiem.slice(-8) == "12:00 AM") {
										meridiem = meridiem.replace("AM","MN");
									}
									else if (meridiem.slice(-8) == "12:00 PM") {
										meridiem = meridiem.replace("PM","NN");
									}

									var current_time = moment().format('LL');
									template = template.replace("(current_date_time)",current_time+" "+meridiem);
									template = template.replace("(current_date)",moment().format("MMMM D, YYYY"));
								}

								if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 00:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 04:00").valueOf()) {
									template = template.replace("(gndmeas_time_submission)","bago mag-07:30 AM");
									template = template.replace("(gndmeas_date_submission)","mamaya");

									template = template.replace("(next_ewi_time)","04:00 AM");
									template = template.replace("(next_ewi_date)","mamayang");
								} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 04:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 08:00").valueOf()) {
									template = template.replace("(gndmeas_time_submission)","bago mag-07:30 AM");
									template = template.replace("(gndmeas_date_submission)","mamaya");

									template = template.replace("(next_ewi_time)","08:00 AM");
									template = template.replace("(next_ewi_date)","mamayang");
								} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 08:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 12:00").valueOf()) {
									template = template.replace("(gndmeas_time_submission)","bago mag-11:30 AM");
									template = template.replace("(gndmeas_date_submission)","mamaya");

									template = template.replace("(next_ewi_time)","12:00 NN");
									template = template.replace("(next_ewi_date)","mamayang");
								} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 12:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 16:00").valueOf()) {
									template = template.replace("(gndmeas_time_submission)","bago mag-:30 PM");
									template = template.replace("(gndmeas_date_submission)","mamaya");

									template = template.replace("(next_ewi_time)","04:00 PM");
									template = template.replace("(next_ewi_date)","mamayang");
								} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 16:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').format("YYYY-MM-DD")+" 20:00").valueOf()) {
									template = template.replace("(gndmeas_time_submission)","bago mag-7:30 AM");
									template = template.replace("(gndmeas_date_submission)","bukas");

									template = template.replace("(next_ewi_time)","08:00 PM");
									template = template.replace("(next_ewi_date)","mamayang");
								} else if (moment(currentTime).valueOf() >= moment(moment().locale('en').format("YYYY-MM-DD")+" 20:00").valueOf() && moment(currentTime).valueOf() < moment(moment().locale('en').add(24, "hours").format("YYYY-MM-DD")+" 00:00").valueOf()) {
									template = template.replace("(gndmeas_time_submission)","bago mag-7:30 AM");
									template = template.replace("(gndmeas_date_submission)","bukas "+moment().add(1,'d').format("MMMM D, YYYY"));

									template = template.replace("(next_ewi_time)","12:00 MN");
									template = template.replace("(next_ewi_date)","bukas ng");
								} else {
									alert("Error Occured: Please contact Administrator");
								}
								$('#msg').val(template);
								$('#site-abbr').val(dashboard_data["name"]);
								$('#constructed-ewi-amd').val(template);
								$('#ewi-asap-modal').modal('toggle');
							}
						});
}
});
}
});
}
}

$(document).ready(function() {

	var user, contactnum;
	var contactnumTrimmed = [];
	var contactInfo;
	var contactname;
	var contactSuggestions;
	var contactsList = [];
	var messages = [];
	var searchResults = [];
	var quick_inbox_registered = [];
	var quick_event_inbox = [];
	var quick_inbox_unknown = [];
	var quick_release = [];
	var temp, tempMsg, tempUser, tempRequest;
	var msgType;
	var WSS_CONNECTION_STATUS = -1;
	var isFirstSuccessfulConnect = true;
	var officesAndSites;
	var employeeTags = [];
	var groupTags = [];
	var testName;
	var testNumbers;
	var multiContactsList = [];
	var timerID = 0;
	var ewirecipients;
	var lastMessageTimeStamp="";
	var lastMessageTimeStampYou="";
	var ewiFlagger = false; 
	var convoFlagger = false;
	var connection_status = true;
	var conn = connectWS();
	var quickGroupSelectionFlag = false;
	var delayReconn = 10000;
	var gsmTimestampIndicator = "";
	var gintags_msg_details;
	var tagger_id = "";
	var temp_ewi_template_holder = "";
	var temp_msg_holder = "";
	var socket = "";
	var narrative_recipients = [];
	var tag_indicator = "";

	if (window.location.host != "www.dewslandslide.com") {
		$.notify('This is a test site: https://'+window.location.host,{autoHideDelay: 100000000});
	}

	$.get( "../generalinformation/initialize", function( data ) {
	});

	$('#ewi-recipients-dashboard').on('beforeItemRemove', function(event) {
		var def_val = $('#default-recipients').val().split(',');
		if ($.inArray(event.item, def_val) != -1) {
			$.notify("You cannot remove default recipients.","info");
			event.cancel = true;
		}
	});

	try {
		var footer = "\n\n-" + first_name + " from PHIVOLCS-DYNASLOPE";
		var remChars = 800 - $("#msg").val().length - footer.length;

		$("#remaining_chars").text(remChars);
		$("#msg").attr("maxlength", remChars);

		var messages_template_both = Handlebars.compile($('#messages-template-both').html());
		var selected_contact_template = Handlebars.compile($('#selected-contact-template').html());
		var quick_inbox_template = Handlebars.compile($('#quick-inbox-template').html());
		var quick_release_template = Handlebars.compile($('#quick-release-template').html());
		var ewi_template = Handlebars.compile($('#ewi_template').html());

	} catch (err) {
		console.log(err);
		console.log("Chatterbox : monitoring dashboard mode");
	}

	function setTargetTime(hour, minute) {
		var t = new Date();
		t.setHours(hour);
		t.setMinutes(minute);
		t.setSeconds(0);
		t.setMilliseconds(0);

		return t;
	}

	function updateRemainingCharacters() {
		remChars = 800 - $("#msg").val().length - footer.length;
		$("#remaining_chars").text(remChars);
	}

	function arraysEqual(a, b) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		if (a.length != b.length) return false;

		for (var i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	}

	function updateMessages(msg) {
		$('#search-key').hide();

		if (msg.user == "You") {

			msg.isyou = 1;

			if (contactInfo == "groups") {
				if (msg.type == "loadEmployeeTag") {
					messages.push(msg);
				} else {
					if (msgType == "smsloadrequestgroup") {
						messages.push(msg);
					} else {
						searchResults.push(msg);
					}
					if(arraysEqual(msg.offices, groupTags.offices)) {
						if (msgType == "searchMessageGroup") {
							searchResults.push(msg);
						} else {
							if (msg.sitenames != undefined|| groupTags.sitenames != undefined){
								if (arraysEqual(msg.sitenames.sort(), groupTags.sitenames)) {
									messages.push(msg);
								}
							}
							else {
								messages.push(msg);
							}
						}
					}
				}
			} 
			else {
				if (msgType == "smsloadrequestgroup") {
					return;
				}
				if (msgType == "searchMessage" || msgType == "smsLoadSearched") {
					searchResults.push(msg);
				} else if (msgType == "searchMessageGlobal"){
					searchResults.push(msg);
				} else {
					messages.push(msg);
				}
			}
		} else {
			if (contactInfo == "groups") {

				if (msg.type == "loadEmployeeTag") {
					msg.isyou = 0;
					messages.push(msg);	
				} else {

					if (msg.name == "unknown") {
						return;
					}

					var isTargetSite = false;
					for (i in groupTags.sitenames) {
						if (msg.name == null || msg.msg != null) {
							msg.isyou = 0;
							msg.user = "PASALOAD REQUEST";
							isTargetSite = true;
							continue;
						} else {
							if ((msg.name.toUpperCase()).indexOf(groupTags.sitenames[i].toUpperCase()) >= 0) {
								isTargetSite = true;
								continue;
							}	
						}
					}

					if (isTargetSite == false) {
						return;
					}

					var isOffices = false;
					for (i in groupTags.offices) {
						if (msg.name == null){
							msg.name = "PASALOAD REQUEST";
							isOffices = true;
							continue;
						} else {
							if ((msg.name.toUpperCase()).indexOf(groupTags.offices[i].toUpperCase()) >= 0) {
								isOffices = true;
								continue;
							}	
						}	
					}

					if (isOffices == false) {
						return;
					}

					if (msg.type == "searchMessageGroup" || msg.type == "smsLoadGroupSearched") {
						msg.isyou = 0;
						msg.user = msg.name;
						searchResults.push(msg);
					} else {
						msg.isyou = 0;
						msg.user = msg.name;
						messages.push(msg);	
					}
				}

			} else {
				for (i in contactInfo) {
					if (msg.type == "searchMessage" || msg.type == "searchMessageGroup" ||
						msg.type == "smsLoadGroupSearched" || msg.type == "smsLoadSearched" || msg.type == "smsloadGlobalSearched"){

						if (contactInfo[i].numbers.search(trimmedContactNum(msg.user)) >= 0) {
							msg.isyou = 0;
							msg.user = contactInfo[i].fullname;
							searchResults.push(msg);
							break;
						}
					} else {
						if (contactInfo[i].numbers.search(trimmedContactNum(msg.user)) >= 0) {
							msg.isyou = 0;
							msg.user = contactInfo[i].fullname;
							messages.push(msg);
							break;
						}
					}
				}
			}
		}

		if (ewiFlagger == false && !(msg.type == "oldMessages" || msg.type == "oldMessagesGroup") &&
			!(msg.type == "searchMessage" || msg.type == "searchMessageGroup" || msg.type == "searchMessageGlobal")){

			try {
				if (messages[counters]['user'] == 'You') {
					if (lastMessageTimeStampYou == "") {
						lastMessageTimeStampYou = messages[counters]['timestamp'];
					}
				} else {
					if (lastMessageTimeStamp == "") {
						lastMessageTimeStamp = messages[counters]['timestamp'];
					}
				}
				if (msg.type == "smssend" || msg.type == "smssendgroup" || msg.type == "smssendgroupemployee") {
					var messages_html = messages_template_both({'messages': messages});
					var htmlString = $('#messages').html();
					$('#messages').html(htmlString+messages_html);
					$('.chat-message').scrollTop($('#messages').height());
					messages = [];

				} else {
					var messages_html = messages_template_both({'messages': messages});
					$('#messages').html(messages_html);
					$('.chat-message').scrollTop($('#messages').height());
				}
			} catch(err){
				console.log(err);
				console.log("Not a Scroll/Search related feature");
			}
		}
	}

	function updateQuickInbox(msg) {
		if (msg.user == "You") {
		}
		else {
			var targetInbox;
			var quick_inbox_html;
			if (msg.name == "unknown") {
				try {
					msg.isunknown = 1;
					targetInbox = "#quick-inbox-unknown-display";
					quick_inbox_unknown.unshift(msg);
					quick_inbox_html = quick_inbox_template({'quick_inbox_messages': quick_inbox_unknown});
				} catch(err) {
				}
			}
			else {
				try {
					msg.isunknown = 0;
					targetInbox = "#quick-inbox-display";
					quick_inbox_registered.unshift(msg);
					quick_inbox_html = quick_inbox_template({'quick_inbox_messages': quick_inbox_registered});
				} catch(err) {
				}
			}
			$(targetInbox).html(quick_inbox_html);
			$(targetInbox).scrollTop(0);
		}
		if (msg.onevent == 1) {
			if (msg.user != "You"){
				var targetInbox;
				var quick_inbox_html;
				msg.isunknown = 0;
				targetInbox = "#quick-event-inbox-display";
				quick_event_inbox.unshift(msg);
				quick_inbox_html = quick_inbox_template({'quick_inbox_messages': quick_event_inbox});
			}

			$(targetInbox).html(quick_inbox_html);
			$(targetInbox).scrollTop(0);
		}
	}

	function updateLatestPublicRelease(msg) {
		try {
			quick_release.unshift(msg);
			var quick_release_html = quick_release_template({'quick_release': quick_release});
			$('#quick-release-display').html(quick_release_html);
			$('#quick-release-display').scrollTop(0);
		} catch(err) {
		}
	}

	function loadMessageHistory(msg) {
		alert("loadMessageHistory!");
	}

	var counters = 0;

	function initLoadMessageHistory(msgHistory) {
		if (msgHistory['hasNull'] == true) {
			for (var i = 0; i < msgHistory['data'].length; i++){
				$('.list-ewi-recipient').append("<li class='list-group-item'><div class='checkbox'><label><input type='checkbox' name='ewi_recipients' value='"+JSON.stringify(msgHistory['data'][i])+"'>"+
					msgHistory['data'][i].office+" "+msgHistory['data'][i].sitename+" "+msgHistory['data'][i].lastname+", "+msgHistory['data'][i].firstname+
					" - "+msgHistory['data'][i].number+"</label></div></li>");
			}
			$('#ewi-recipient-update-modal').modal('toggle');
		} else {

			if (msgHistory.data == null) {
				return;
			}

			console.log("initLoadMessageHistory");
			var history = msgHistory.data;
			ewirecipients = msgHistory;
			temp = msgHistory.data;
			var msg;
			for (var i = history.length - 1; i >= 0; i--) {
				msg = history[i];
				updateMessages(msg);
				counters++;
			}
			counters = 0;
		}
	}

	$('#confirm-ewi-recipients').click(function(){
		var recipientsUpdate = [];
		$('input[name="ewi_recipients"]:checked').each(function() {
			recipientsUpdate.push(JSON.parse(this.value));
		});

		request = {'type': "updateEwiRecipients",
		'data': recipientsUpdate
	}

	console.log(recipientsUpdate);
	conn.send(JSON.stringify(request));
});

	function updateOldMessages(oldMessages){

		if (contactInfo == "groups") {
			if (oldMessages.user == "You"){
				oldMessages.isyou = 1;
				messages.push(oldMessages);
			} else {
				oldMessages.isyou = 0;
				var isTargetSite = false;
				for (i in groupTags.sitenames) {
					if ((oldMessages.name.toUpperCase()).indexOf(groupTags.sitenames[i].toUpperCase()) >= 0) {
						isTargetSite = true;
						continue;
					}
				}
				if (isTargetSite == false) {
					return;
				}
				var isOffices = false;
				for (i in groupTags.offices) {
					if ((oldMessages.name.toUpperCase()).indexOf(groupTags.offices[i].toUpperCase()) >= 0) {
						isOffices = true;
						continue;
					}
				}

				if (isOffices == false) {
					return;
				}
				oldMessages.user = oldMessages.name;
				messages.push(oldMessages);
			}
		} else {
			for (i in contactInfo) {	
				if (oldMessages.user == 'You') {
					oldMessages.isyou = 1;
					messages.push(oldMessages);
				} else {
					if (contactInfo[i].numbers.search(oldMessages.user) >= 0) {
						oldMessages.isyou = 0;
						oldMessages.user = contactInfo[i].numbers;
						messages.push(oldMessages);
					} else {
						oldMessages.isyou = 0;
						oldMessages.user = contactInfo[i].fullname;
						messages.push(oldMessages);
					}
				}
			}
		}
	}

	var tempTimestampYou;
	var tempTimestamp;

	function loadOldMessages(msg){
		counters = 0;
		lastMessageTimeStampYou = "";
		lastMessageTimeStamp = "";

		var oldMessagesIndi = msg.data;
		var oldMsg;
		messages = [];

		if (msg.data != null){
			for (var i = oldMessagesIndi.length - 1; i >= 0; i--) {
				oldMsg = oldMessagesIndi[i];
				oldMsg["type"] = msg.type;
				updateOldMessages(oldMsg);
				if (messages[counters].user == 'You'){
					if (lastMessageTimeStampYou == "") {
						lastMessageTimeStampYou = messages[counters]['timestamp'];
						tempTimestampYou = lastMessageTimeStampYou;
					}
				} else {
					if (lastMessageTimeStamp == "") {
						lastMessageTimeStamp = messages[counters]['timestamp'];
						tempTimestamp = lastMessageTimeStamp;
					}
				}
				counters++;
			}

			var htmlStringMessage = $('#messages').html();
			var messages_html = messages_template_both({'messages': messages});
			$('#messages').html(messages_html+htmlStringMessage);
			$('html, body').scrollTop(200);
		} else {
			convoFlagger = true;
			alert("End of the Conversation");
			console.log("Invalid Request/End of the Conversation");
		}
		console.log("Loading Old Messages");
	}

	function getOldMessage(){
		if (lastMessageTimeStampYou == "") {
			lastMessageTimeStampYou = tempTimestampYou;
		}

		if (lastMessageTimeStamp == "") {
			lastMessageTimeStamp = tempTimestamp;
		}

		var request = {
			'type': 'oldMessage',
			'number': contactnumTrimmed,
			'timestampYou': lastMessageTimeStampYou,
			'timestampIndi': lastMessageTimeStamp
		};

		tempTimestampYou  = lastMessageTimeStampYou;
		tempTimestamp = lastMessageTimeStamp;

		$('#user').val('You');
		messages = [];

		conn.send(JSON.stringify(request));
	}

	function getOldMessageGroup(){
		groupTags = [];
		user = "You";
		var tagOffices = [];
		$('input[name="offices"]:checked').each(function() {
			tagOffices.push(this.value);
		});

		var tagSitenames = [];
		$('input[name="sitenames"]:checked').each(function() {
			tagSitenames.push(this.value);
		});

		tagSitenames.sort();
		if (lastMessageTimeStampYou == "") {
			lastMessageTimeStampYou = tempTimestampYou;
		}

		if (lastMessageTimeStamp == "") {
			lastMessageTimeStamp = tempTimestamp;
		}

		request = {
			'type': 'oldMessageGroup',
			'offices': tagOffices,
			'sitenames': tagSitenames,
			'lastMessageTimeStampYou': lastMessageTimeStampYou,
			'lastMessageTimeStampGroup':lastMessageTimeStamp
		};

		groupTags = {
			'type': 'oldMessageGroup',
			'offices': tagOffices,
			'sitenames': tagSitenames
		};

		tempTimestampYou  = lastMessageTimeStampYou;
		tempTimestamp = lastMessageTimeStamp;

		$('#user').val('You');

		messages = [];
		contactInfo = "groups";
		conn.send(JSON.stringify(request));
	}

	function initLoadQuickInbox(quickInboxMsg) {

		if (quickInboxMsg.data == null) {
			return;
		}

		console.log("initLoadQuickInbox");
		var qiMessages = quickInboxMsg.data;
		temp = quickInboxMsg.data;
		var msg;
		for (var i = qiMessages.length - 1; i >= 0; i--) {
			msg = qiMessages[i];
			updateQuickInbox(msg);
		}
	}

	function initLoadLatestAlerts(latestAlerts){
		if (latestAlerts.data == null) {
			return;
		}

		console.log("Loading Latest Public Releases.");
		var alerts = latestAlerts.data;
		temp = latestAlerts.data;
		var msg;
		for (var i = alerts.length - 1; i >= 0; i--) {
			msg = alerts[i];
			updateLatestPublicRelease(msg);
			$('input[name="sitenames"]:unchecked').each(function() {
				if ($(this).val().toLowerCase() == alerts[i].name) {
					if (alerts[i].status == "on-going") {
						$(this).parent().css('color','red');
					} else if (alerts[i].status == "extended") {
						$(this).parent().css('color','blue');
					} else {
						$(this).parent().css('color','green');
					}
				}
			});
		}
	}

	function loadOfficesAndSites(msg) {
		var offices = msg.offices;
		var sitenames = msg.sitenames;
		var office, sitename;
		for (var i = 0; i < offices.length; i++) {
			var modIndex = i % 5;

			office = offices[i];
			$("#offices-"+modIndex).append('<div class="checkbox"><label><input name="offices" type="checkbox" value="'+office+'">'+office+'</label></div>');
		}
		for (var i = 0; i < sitenames.length; i++) {
			var modIndex = i % 6;

			sitename = sitenames[i];
			$("#sitenames-"+modIndex).append('<div class="checkbox"><label><input name="sitenames" type="checkbox" value="'+sitename+'">'+sitename+'</label></div>');
		}
	}
	function connectWS() {
		$('#chatterbox-loading').modal('show');
		console.log("trying to connect to web socket server");
		var tempConn = new WebSocket("ws://"+window.location.host+":5050");

		tempConn.onopen = function(e) {
			console.log("Connection established!");
			enableCommands();

			connection_status = true;
			WSS_CONNECTION_STATUS = 0;
			delayReconn = 10000;

			if (isFirstSuccessfulConnect) {
				getOfficesAndSitenames();
				setTimeout(
					function() {
						getInitialQuickInboxMessages();
						getLatestAlert();
					}, 
					500);
				isFirstSuccessfulConnect = false;
			}
			if (window.timerID) {
				window.clearInterval(window.timerID);
				window.timerID = 0;
			}
			$("#send-msg").removeClass("disabled");
		};

		tempConn.onmessage = function(e) {
			var msg = JSON.parse(e.data);
			tempMsg = msg;
			msgType = msg.type;
			if ((msg.type == "smsload") || (msg.type == "smsloadrequestgroup") || (msg.type == "loadEmployeeTag")){
				$('#chatterbox-loading').modal('hide');
				initLoadMessageHistory(msg);
			}  else if (msg.type == "hasNullEWIRecipient"){
				initLoadMessageHistory(msg);
			} else if (msg.type == "resumeLoading") {
				$('#ewi-recipient-update-modal').modal('toggle');
				loadGroups();
			} else if (msg.type == "oldMessage"){
				loadOldMessages(msg);
				msgType = "smsload"
			} else if (msg.type == "oldMessageGroup"){
				loadOldMessages(msg);
				msgType = "smsloadrequestgroup";
			} else if (msg.type == "searchMessage"){
				$('#chatterbox-loading').modal('hide');
				loadSearchedMessage(msg);
				msgType = "searchMessage";
			} else if (msg.type == "searchMessageGlobal") {
				$('#chatterbox-loading').modal('hide');
				loadSearchedMessage(msg);
			} else if (msg.type == "searchMessageGroup") {
				$('#chatterbox-loading').modal('hide');
				loadSearchedMessage(msg);
				msgType = "searchMessageGroup";
			} else if (msg.type == "searchGintags") {
				$('#chatterbox-loading').modal('hide');
				loadSearchedMessage(msg);
			} else if (msg.type == "smsLoadSearched" || msg.type == "smsLoadGroupSearched"){
				$('#chatterbox-loading').modal('hide');
				loadSearchedMessage(msg);
			} else if (msg.type == "smsloadGlobalSearched"){
				$('#chatterbox-loading').modal('hide');
				loadSearchedMessage(msg);
			} else if (msg.type == "smsloadquickinbox") {
				initLoadQuickInbox(msg)
			} else if (msg.type == "latestAlerts"){
				initLoadLatestAlerts(msg);
				$('#chatterbox-loading').modal('hide');
			} else if (msg.type == "loadofficeandsites") {
				officesAndSites = msg;
				loadOfficesAndSites(officesAndSites);
			} else if (msg.type == "loadnamesuggestions") {
				contactSuggestions = msg.data;

				if (msg.data == null) {
					return;
				}

				var suggestionsArray = [];
				for (var i in msg.data) {
					var suggestion = msg.data[i].fullname.replace(/\?/g,function(){return "\u00f1"}) + 
					" - " + msg.data[i].numbers;
					suggestionsArray.push(suggestion);
				}

				comboplete.list = suggestionsArray;
			} else if (msg.type == "ewi_tagging") {
				gintags_collection = [];
				var tag = "";
				if ($('#edit-btn-ewi-amd').val() === "edit") {
					tag = "#EwiMessage";
					$("#messages li").last().addClass("tagged");
				} else if ($('#edit-btn-ewi-amd').val() === "undo"){
					tag = "#AlteredEWI";
					$("#messages li").last().addClass("tagged");
				}

				temp_msg_holder.sms_id = msg["data"][parseInt(msg["data"].length - 1)];
				updateMessages(temp_msg_holder);
				var current_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
				if (tag != "") {
					for (var i = 0; i < msg["data"].length; i++) {
						gintags = {
							'tag_name': tag,
							'tag_description': "communications",
							'timestamp': current_timestamp,
							'tagger': tagger_user_id,
							'table_element_id': msg["data"][i][0],
							'table_used': "smsoutbox",
							'remarks': ""
						}
						gintags_collection.push(gintags)
					}
					$.post( "../generalinformation/insertGinTags/", {gintags: gintags_collection})
					.done(function(response) {
						var event_details = JSON.parse($('#event_details').val());
						var current_recipients = $('#ewi-recipients-dashboard').tagsinput('items');
						var tagOffices = [];

						$('input[name="offices"]:checked').each(function() {
							tagOffices.push(this.value);
						});

						var raw_recipient = $('#ewi-recipients-dashboard').val().split(',');
						for (var recipient_counter = 0; recipient_counter < raw_recipient.length; recipient_counter++) {
							if ($.inArray(raw_recipient[recipient_counter].slice(0, raw_recipient[recipient_counter].indexOf(':')), narrative_recipients) == -1) {
								narrative_recipients.push(raw_recipient[recipient_counter].slice(0, raw_recipient[recipient_counter].indexOf(':')));
							}
						}

						if (narrative_recipients.length > 0 || tagOffices.length > 0) {
							if (tag == "#EwiMessage" || tag == "#AlteredEWI") {
								var narrative_template = "";

								if (narrative_recipients.length > 0) {
									narrative_recipients.forEach(function(x) {
										narrative_template = narrative_template+", "+x.trim();
									});
								} else {
									tagOffices.forEach(function(x) {
										narrative_template = narrative_template+", "+x.trim();
									});
								}
								var x = moment(data_timestamp).hour() % 1 == 0  && moment(data_timestamp).minute() == 30 ?  moment(data_timestamp).add(30,'m').format("hh:mm A") : moment(data_timestamp).format("hh:mm A");
								if(/12:\d{2} PM/g.test(x)) x = x.replace("PM", "NN"); else if (/12:\d{2} AM/g.test(x)) x = x.replace("AM", "MN");
								narrative_template = "Sent "+x+" EWI SMS to "+narrative_template.substring(1);
								narrative_recipients = [];
							} 
						}

						if (tag == "#EwiMessage" || tag == "#AlteredEWI") {
							var narrative_details = {
								'event_id': event_details.event_id,
								'site_id': event_details.site_id,
								'municipality': event_details.municipality,
								'province': event_details.province,
								'barangay': event_details.barangay,
								'sition': event_details.sition,
								'ewi_sms_timestamp': current_timestamp,
								'narrative_template': narrative_template
							}

							$.post( "../narrativeAutomation/insert/", {narratives: narrative_details})
							.done(function(response) {
								var start = moment().format('YYYY-MM-DD HH:mm:ss');
								var rounded_release;
								var last_rounded_release;
								var previous_release;

								if (moment(start).minute() < 30) {
									var rounded_release = moment(start).startOf('hour').format('YYYY-MM-DD HH:mm:ss');
								} else {
									var rounded_release = moment(start).add(1,'h').startOf('hour').format('YYYY-MM-DD HH:mm:ss');
								}

								var current_release_day = moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss');

								if (moment(moment(event_details.data_timestamp).add(30,'m')).hour() % 4 != 0) {
									var onset = moment(event_details.data_timestamp).format('YYYY-MM-DD HH:mm:ss');
								}

								if (moment(rounded_release).hour() % 4 == 0 && moment(event_details.data_timestamp).add(30,'m').hour() % 4 == 0) {
									last_rounded_release = moment(rounded_release).subtract(4,'h').format('YYYY-MM-DD HH:mm:ss');
								} else {
									last_rounded_release = moment(event_details.data_timestamp).format('YYYY-MM-DD HH:mm:ss');
								}

								previous_release = moment(last_rounded_release).subtract(210,'m').format('YYYY-MM-DD HH:mm:ss');

								var lastReleaseData = {
									'event_id': event_details.event_id,
									'current_release_time': rounded_release,
									'last_release_time': last_rounded_release,
									'previous_release': previous_release,
									'data_timestamp': event_details.data_timestamp
								}

								$.post("../narrativeautomation/checkack/",{last_release : lastReleaseData}).done(function(data){
									console.log(data);
									var response = JSON.parse(data);
									if (response.ack == "no_ack") {
										var narrative_details = {
											'event_id': event_details.event_id,
											'site_id': event_details.site_id,
											'municipality': event_details.municipality,
											'province': event_details.province,
											'barangay': event_details.barangay,
											'sition': event_details.sition,
											'ewi_sms_timestamp': moment(data_timestamp).add(29,'m').format('YYYY-MM-DD HH:mm:ss'),
											'narrative_template': "No acknowledgement from the community for "+moment(last_rounded_release).format('hh:mm A')+" EWI Release"
										}
										$.post("../narrativeAutomation/insert/", {narratives: narrative_details}).done(function(data){
											console.log(data);
										});
									}
								});
							});
						} 
					});
}
} else {
	var numbers = /^[0-9]+$/; 
	if (msg.type == "ackgsm") {
		if ($("#chat-user").text() == "You" && $("#messages li:last #timestamp-written").text() == gsmTimestampIndicator) {
			$("#messages li:last #timestamp-sent").html(msg.timestamp_sent);
		}
	} else if (msg.type == "ackrpi"){
		console.log("Status: "+msg.type);
	} else if (contactInfo == "groups") {

		if (msg.type == "smsrcv") {
			$.notify("New Message Received!","info");
			updateQuickInbox(msg);
		} 

		var select_raw_site = $("#current-contacts h4").text().substring(11);
		var selected_site = select_raw_site.substring(0,select_raw_site.indexOf(']')).replace(/\s/g,'').split(",");

		var select_raw_office = select_raw_site.substring(select_raw_site.indexOf(']'));
		var selected_office = select_raw_office.substring(13,select_raw_office.length-1).replace(/\s/g,'').split(",");

		var sender = msg.name.split(" ");

		for (var i = 0; i < selected_site.length; i++) {
			console.log(selected_site[i]);
			console.log(sender[0]);
			if (selected_site[i] == sender[0]) {
				for (var x = 0; x < selected_office.length; x++) {
					console.log(selected_office[x]);
					console.log(sender[1]);
					if (selected_office[x] == sender[1]) {
						updateMessages(msg);
					}
				}
			}
		}
	} else {

		if (msg.type == "smsrcv") {
			$.notify("New Message Received!","info");
			updateQuickInbox(msg);
		} 

		if(msg.user.match(numbers)) {
			console.log("all numbers");
			for (i in contactnumTrimmed) {
				if (normalizedContactNum(contactnumTrimmed[i]) == normalizedContactNum(msg.user)) {
					updateMessages(msg);
					return;
				}
			}
		} else {
			console.log("alphanumeric keywords for msg.user");
			for (i in contactnumTrimmed) {
				for (j in msg.numbers) {
					if (normalizedContactNum(contactnumTrimmed[i]) == normalizedContactNum(msg.numbers[j])) {
						updateMessages(msg);
						return;
					}
				}
			}
		}
	}
}
}

tempConn.onclose = function(e) {
	WSS_CONNECTION_STATUS = -1;

	var reason;
	if (event.code == 1000)
		reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
	else if(event.code == 1001)
		reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
	else if(event.code == 1002)
		reason = "An endpoint is terminating the connection due to a protocol error";
	else if(event.code == 1003)
		reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
	else if(event.code == 1004)
		reason = "Reserved. The specific meaning might be defined in the future.";
	else if(event.code == 1005)
		reason = "No status code was actually present.";
	else if(event.code == 1006) {
		reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
		disableCommands();

		connection_status = false;
		$("#send-msg").addClass("disabled");
		waitForSocketConnection();
	}
	else if(event.code == 1007)
		reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
	else if(event.code == 1008)
		reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
	else if(event.code == 1009)
		reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
	else if(event.code == 1010)
		reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
	else if(event.code == 1011)
		reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
	else if(event.code == 1015)
		reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
	else
		reason = "Unknown reason";

	console.log(reason);
}

return tempConn;
}

function getOngoingEvents(sites){
	$.get( "../chatterbox/getOnGoingEventsForGintags", function( data ) {
		var events = JSON.parse(data);
		$.post( "../chatterbox/getSiteForNarrative/", {site_details: JSON.stringify(sites)})
		.done(function(response) {
			siteids = JSON.parse(response);
			for (var counter = 0; counter < events.length; counter++) {
				for (var siteid_counter = 0; siteid_counter < siteids.length; siteid_counter++) {
					if (events[counter].site_id == siteids[siteid_counter].id) {
						var narrative_template = "";
						if (gintags_msg_details.tags === "#EwiResponse" || gintags_msg_details.tags === "#GroundMeas") {
							if (gintags_msg_details.tags === "#EwiResponse") {
								narrative_template = "Early warning information acknowledged by "+gintags_msg_details[1]+" ("+gintags_msg_details[4]+")";
							} else {
								narrative_template = gintags_msg_details[1]+" sent surficial measurement <insert trend here>";
							}
						} else if (gintags_msg_details.tags === "#EwiMessage" || gintags_msg_details.tags === "#GroundMeasReminder"){
							var tagOffices = [];
							$('input[name="offices"]:checked').each(function() {
								tagOffices.push(this.value);
							});

							if  (tagOffices.length == 0) {
								tagOffices = [];
								var contactIdentifier = $('#contact-indicator').val().split(" ");
								tagOffices.push(contactIdentifier[1]);
							}

							if (narrative_recipients.length > 0 || tagOffices.length > 0) {
								if (narrative_recipients.length > 0) {
									narrative_recipients.forEach(function(x) {
										narrative_template = narrative_template+", "+x.trim();
									});
								} else {
									tagOffices.forEach(function(x) {
										narrative_template = narrative_template+", "+x.trim();
									});
								}
								if (gintags_msg_details.tags === "#EwiMessage") {
									var x = moment(data_timestamp).hour() % 1 == 0  && moment(data_timestamp).minute() == 30 ?  moment(data_timestamp).format("hh:mm A").add(30,'m') : moment(data_timestamp).format("hh:mm A");
									if(/12:\d{2} PM/g.test(x)) x = x.replace("PM", "NN"); else if (/12:\d{2} AM/g.test(x)) x = x.replace("AM", "MN");
									narrative_template = "Sent "+x+" EWI SMS to "+narrative_template.substring(1);
								} else {
									narrative_template = "Sent Ground measurement reminder";
								}
							}
						} else {
							$.notify("Invalid request, please try again.","warning");
						}
						var narrative_details = {
							'event_id': events[counter].event_id,
							'site_id': siteids[siteid_counter].id,
							'ewi_sms_timestamp': gintags_msg_details[2],
							'narrative_template': narrative_template
						}
						$.post( "../narrativeAutomation/insert/", {narratives: narrative_details})
						.done(function(response) {
							var start = moment().format('YYYY-MM-DD HH:mm:ss');
							var rounded_release;
							var last_rounded_release;

							if (moment(start).minute() < 30) {
								var rounded_release = moment(start).startOf('hour').format('YYYY-MM-DD HH:mm:ss');
							} else {
								var rounded_release = moment(start).add(1,'h').startOf('hour').format('YYYY-MM-DD HH:mm:ss');
							}

							var current_release_day = moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss');

							if (moment(rounded_release).hour() % 4 == 0) {
								last_rounded_release = moment(rounded_release).subtract(4,'h').format('YYYY-MM-DD HH:mm:ss');
							} else {
								last_rounded_release = moment(current_release_day).add(moment(rounded_release).hour()- moment(rounded_release).hour() % 4,'h').format('YYYY-MM-DD HH:mm:ss');
							}

							var lastReleaseData = {
								'event_id': events[counter].event_id,
								'current_release_time': rounded_release,
								'last_release_time': last_rounded_release
							}

							$.post("../narrativeautomation/checkack/",{last_release : lastReleaseData}).done(function(data){
								var response = JSON.parse(data);
								if (response.ack == "no_ack") {
									var narrative_details = {
										'event_id': events[counter].event_id,
										'site_id': siteids[siteid_counter].id,
										'ewi_sms_timestamp': rounded_release,
										'narrative_template': "No ACK for "+moment(last_rounded_release).format('HH:mm A')+" EWI Release"
									}
									$.post("../narrativeAutomation/insert/", {narratives: narrative_details}).done(function(data){
										console.log(data);
									});
								}
							});
						});
					}
				}
			}
		});
});
}

function waitForSocketConnection() {
	if (!window.timerID) {
		window.timerID = setInterval(
			function () {
				if (conn.readyState === 1) {
					console.log("Connection is made");
					return;

				} else {
					console.log("wait for connection... " + delayReconn);
					conn = connectWS();
					waitForSocketConnection();
					if (delayReconn < 20000) {
						delayReconn += 1000;
					}
				}
			}, delayReconn);
	}
}
function trimmedContactNum(inputContactNumber) {
	var numbers = /^[0-9]+$/;  
	var trimmed;
	var targetNumber = inputContactNumber.replace(/[^0-9]/igm,'');
	if(targetNumber.match(numbers)) {  
		var size = targetNumber.length;

		if (size == 12) {
			trimmed = targetNumber.slice(2, size);
		} 
		else if (size == 11) {
			trimmed = targetNumber.slice(1, size);
		}
		else if (size == 10) {
			trimmed = targetNumber;
		}
		else {
			console.log('Error: No such number in the Philippines');  
			return -1;
		}

		inputContactNumber = "63" + trimmed;
		return trimmed;
	}  
	else {  
		console.log('Please input numeric characters only');  
		return -1;
	}  
}
function normalizedContactNum(targetNumber) {
	var trimmed = trimmedContactNum(targetNumber);

	if (trimmed < 0) {
		console.log("Error: Invalid Contact Number");
		return -1;
	} 
	else {
		return "63" + trimmed;
	}
}

function getNameSuggestions (nameQuery) {
	var nameSuggestionRequest = {
		'type': 'requestnamesuggestions',
		'namequery': nameQuery,
	};
	conn.send(JSON.stringify(nameSuggestionRequest));
};

function parseContactInfo (multipleContactInfo) {
	parseSingleContactInfo(multipleContactInfo);
}

function parseSingleContactInfo (singleContactInfo) {
	var n = singleContactInfo.search(' - ');
	var size = singleContactInfo.length;
	testName = singleContactInfo.slice(0,n);
	testNumbers = singleContactInfo.slice(n + 3,singleContactInfo.length);
	var tempNum;
	var searchIndex = 0;

	while (searchIndex >= 0) {
		searchIndex = testNumbers.search(",");
		var parsedInfo = {};
		parsedInfo.fullname = testName;

		if (searchIndex < 0) {
			parsedInfo.numbers = testNumbers;
			contactnumTrimmed.push(trimmedContactNum(parsedInfo.numbers));
		} 
		else {
			parsedInfo.numbers = testNumbers.slice(0,searchIndex);
			contactnumTrimmed.push(trimmedContactNum(parsedInfo.numbers));
			testNumbers = testNumbers.slice(searchIndex + 1);
		}

		multiContactsList.push(parsedInfo);
	}
}

function getFollowingNameQuery (allNameQueries) {
	var before = allNameQueries.match(/^.+;\s*|/)[0];
	var size = before.length;
	var nameQuery = allNameQueries.slice(size);

	return nameQuery;
}

function displayContactNamesForThread (source="normal") {
	if (source == "normal") {
		var flags = [], uniqueName = [], l = contactInfo.length, i;
		for( i=0; i<l; i++) {
			if( flags[contactInfo[i].fullname]) 
				continue;

			flags[contactInfo[i].fullname] = true;
			uniqueName.push(contactInfo[i].fullname);
		}

		var tempText = "", tempCountContacts = uniqueName.length;
		for (i in uniqueName) {
			console.log(uniqueName[i]);

			if (i == tempCountContacts - 1)
				tempText = tempText + uniqueName[i];
			else
				tempText = tempText + uniqueName[i] + ", ";
		}
	}
	else if (source == "quickInbox") {
		if (qiFullContact.search("unknown") >= 0) {
			tempText = qiFullContact;
			document.title = tempText;
		} 
		else {
			var posDash = qiFullContact.search(" - ");
			tempText = qiFullContact.slice(0, posDash);
		}
	}
	$("#convo-header .panel-heading").text(tempText);
	$("#convo-header .panel-body").text(contactInfo[0].numbers);
	$("#contact-indicator").val(tempText);
	document.title = tempText;
}

$('#btn-standard-search').click(function(){
	if ($('#search-key').is(":visible") == true && $('#search-key').val() != "") {
		searchMessage();
	} else if ($('#search-key').is(":visible") == true && $('#search-key').val() == ""){
		$('#search-key').hide();
	} else {
		$('#search-key').show();
		$('#search-key').val("");	
	}
});

$('#btn-search-global').click(function(){
	switch($('input[name="opt-search"]:checked').val()) {
		case "gintag-search":
		searchGintagMessages($('#search-global-keyword').val());
		break;
		case "global-search":
		searchMessageGlobal($('#search-global-keyword').val());
		break;
	}
});

function searchMessage(){
	messages = [];
	searchResults = [];
	if (msgType == "smsload" || msgType == "searchMessage") {
		searchMessageIndividual();
	} else if (msgType == "smssendgroup" || msgType == "searchMessageGroup" || msgType == "smsloadrequestgroup"){
		searchMessageGroup();
	} else {
		console.log(msgType);
		console.log("Invalid Request");
	}
}

function searchMessageIndividual(){
	for (var numLen = 0; numLen < contactnumTrimmed.length; numLen++){
		if (contactnumTrimmed[numLen].length == 12){
			contactnumTrimmed[numLen] = contactnumTrimmed[numLen].slice(2);
		} else if (contactnumTrimmed[numLen].length == 11){
			contactnumTrimmed[numLen] = contactnumTrimmed[numLen].slice(1);
		} else {
		}
	}
	var request = {
		'type': 'searchMessageIndividual',
		'number': contactnumTrimmed,
		'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
		'searchKey': $('#search-key').val()
	};

	conn.send(JSON.stringify(request));
}

function searchMessageGroup(){
	groupTags = [];

	user = "You";

	var tagOffices = [];
	$('input[name="offices"]:checked').each(function() {
		tagOffices.push(this.value);
	});

	var tagSitenames = [];
	$('input[name="sitenames"]:checked').each(function() {
		tagSitenames.push(this.value);
	});
	tagSitenames.sort();

	request = {
		'type': 'searchMessageGroup',
		'offices': tagOffices,
		'sitenames': tagSitenames,
		'searchKey': $('#search-key').val()
	};

	groupTags = {
		'type': 'searchMessageGroup',
		'offices': tagOffices,
		'sitenames': tagSitenames,
		'searchKey': $('#search-key').val()
	};

	messages = [];
	contactInfo = "groups";
	conn.send(JSON.stringify(request));
}

function searchMessageGlobal(searchKey){
	request = {
		'type': "searchMessageGlobal",
		'searchKey': searchKey
	}
	console.log(request);
	conn.send(JSON.stringify(request));
}

function searchGintagMessages(searchKey){
	console.log(searchKey);
	request = {
		'type': "searchGintagMessages",
		'searchKey': searchKey
	}
	conn.send(JSON.stringify(request));
}

var coloredTimestamp;

$(document).on("click","#search-result li",function(){
	var data = ($(this).closest('li')).find("input[id='msg_details']").val().split('<split>');
	console.log(($(this).closest('li')).find("input[id='msg_details']").val());
	loadSearchKey(data[0],data[1],data[2],data[3],data[4]);
})

$(document).on("click","#search-global-result li",function(){
	var data = ($(this).closest('li')).find("input[id='msg_details']").val().split('<split>');
	loadSearchKey(data[0],data[1],data[2],data[3],data[4]);
})

function loadSearchKey(type,user,timestamp,user_number = null,sms_message = null){
	$('#search-result-modal').modal('hide');
	coloredTimestamp = "id_"+timestamp;
	if (type == "searchMessage") {
		var request = {
			'type': 'smsLoadSearched',
			'number': contactnumTrimmed,
			'timestamp': timestamp
		};

		conn.send(JSON.stringify(request));
	} else if (type == "searchMessageGroup"){
		var timestampYou = "";
		var timestampGroup = "";

		var tagOffices = [];
		$('input[name="offices"]:checked').each(function() {
			tagOffices.push(this.value);
		});

		var tagSitenames = [];
		$('input[name="sitenames"]:checked').each(function() {
			tagSitenames.push(this.value);
		});

		if (user == 'You') {
			timestampYou = timestamp;
		} else {
			timestampGroup = timestamp;
		}

		request = {
			'type': 'smsLoadGroupSearched',
			'offices': tagOffices,
			'sitenames': tagSitenames,
			'timestampYou': timestampYou,
			'timestampGroup': timestampGroup
		};

		conn.send(JSON.stringify(request));

	} else if (type == "searchMessageGlobal" || type == "searchGintags"){
		contactInfo = [{'fullname':user,'numbers': '0'+trimmedContactNum(user_number)}];

		$("#current-contacts h4").text(user);
		document.title = user;
		contactnumTrimmed = [];

		request = {
			'type': 'smsloadGlobalSearched',
			'user': user,
			'user_number': user_number,
			'sms_msg': sms_message,
			'timestamp': timestamp
		}
		contactnumTrimmed = [user_number];
		user = "You";

		conn.send(JSON.stringify(request));

	}
}

try {
	Handlebars.registerHelper('ifCond', function(v1, v2, v3, v4, v5,options) {
		if(v1 === v2 || v1 == v3 || v1 == v4 || v1 == v5) {
			return options.fn(this)
		} else {
			return options.inverse(this);	
		}
	});

	Handlebars.registerHelper('breaklines', function(text) {
		text = Handlebars.Utils.escapeExpression(text);
		text = text.replace(/(\r\n|\n|\r)/gm, ' ');
		return new Handlebars.SafeString(text);
	});

	Handlebars.registerHelper('escape', function(variable) {
		return variable.replace(/(['"-])/g, '\\$1');
	});
} catch (err) {
}

function loadSearchedMessage(msg){
	counters = 0;
	if (msg.type == "searchMessage" || msg.type == "searchMessageGroup") {
		messages = [];
		searchResults = [];
		var searchedResult = msg.data;
		var res;
		try {
			for (var i = searchedResult.length - 1; i >= 0; i--) {
				res = searchedResult[i];
				updateMessages(res);
				counters++;
			}
		} catch(err) {
			console.log("No Result/Invalid Request");
		}
		var messages_html = messages_template_both({'messages': searchResults});
		$('#search-result').html(messages_html);
		$('#search-result-modal').modal('toggle');

		if (msg.type == "searchMessage") {
			msgType = "smsload";
		} else {
			msgType = "smsloadrequestgroup";
		}
		counters = 0;

	} else if (msg.type == "smsLoadSearched" || msg.type == "smsLoadGroupSearched"){
		messages = [];
		var searchedResult = msg.data;
		var res;
		try {
			for (var i = 0;i < searchedResult.length; i++) {
				res = searchedResult[i];
				updateMessages(res);
				if (contact_header == ""){
					if (res.user != "You"){
						contact_header = res.user;
					}
				}
				counters++;
			}
		} catch(err) {
			console.log("No Result/Invalid Request");
		}

		var messages_html = messages_template_both({'messages': searchResults});
		$('#messages').html(messages_html);
		messages = [];

		if (msg.type == "smsLoadSearched" || msg.type == "smsloadGlobalSearched") {
			msgType = "smsload";
		} else if (msg.type == "smsLoadGroupSearched") {
			msgType = "smsloadrequestgroup";
		}
		counters = 0;

		var targetLi = document.getElementById(coloredTimestamp);
		targetLi.style.border = "solid";
		targetLi.style.borderColor = "#dff0d8";
		targetLi.style.borderRadius = "3px";
		targetLi.style.borderWidth = "5px";
		$('html, body').scrollTop(targetLi.offsetTop - 300);

	} else if (msg.type == "smsloadGlobalSearched"){
		messages = [];
		var searchedResult = msg.data;
		var res;
		var contact_header = "";
		try {
			for (var i = searchedResult.length - 1; i >= 0; i--) {
				res = searchedResult[i];
				updateGlobalMessage(res);
				if (contact_header == ""){
					if (res.user != "You"){
						contact_header = res.user;
					}
				}
				counters++;
			}
		} catch(err) {
			console.log("No Result/Invalid Request");
		}
		msgType = "smsload";
		var messages_html = messages_template_both({'messages': searchResults});
		$('#messages').html(messages_html);
		counters = 0;

		$("#current-contacts h4").text(contact_header);
		document.title = contact_header;

		$('#main-container').removeClass('hidden');
		$('#search-global-message-modal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();

		var targetLi = document.getElementById(coloredTimestamp);
		targetLi.style.borderColor = "#dff0d8";
		targetLi.style.borderRadius = "3px";
		targetLi.style.borderWidth = "5px";
		console.log(targetLi.offsetTop);
		$('html, body').scrollTop(targetLi.offsetTop - 300);

	} else if (msg.type == "searchMessageGlobal"  || msg.type == "searchGintags"){
		messages = [];
		var searchedResult = msg.data;
		var res;
		try {
			for (var i =  0; i < searchedResult.length; i++) {
				res = searchedResult[i];
				updateGlobalMessage(res);
				counters++;
			}
		} catch(err) {
			console.log("No Result/Invalid Request");
		}

		var messages_html = messages_template_both({'messages': searchResults});
		$('#search-global-result').html(messages_html);
		var maxScroll = $(document).height() - $(window).height();
		$('#search-global-result').scrollTop(maxScroll);

	} else {
		console.log("No Result/Invalid Request");
	}
	searchResults = [];
	counters = 0;
}

function updateGlobalMessage(msg){
	if (msg.user == "You") {
		msg.isyou = 1;
		searchResults.push(msg);
	} else {
		msg.isyou = 0;
		msg.user = msg.user;
		searchResults.push(msg);
	}
}

function displayGroupTagsForThread () {
	var tempText = "[Sitenames: ";
	var titleSites = "";
	var tempCountSitenames = groupTags.sitenames.length;
	$("#convo-header .panel-body").text("");
	for (i in groupTags.sitenames) {
		displayDetailsForThread(groupTags.sitenames[i]);
		if (i == tempCountSitenames - 1) {
			tempText = tempText + groupTags.sitenames[i];
			titleSites = titleSites + groupTags.sitenames[i];
		} else {
			tempText = tempText + groupTags.sitenames[i] + ", ";
			titleSites = titleSites + groupTags.sitenames[i] + ", ";
		}
	}
	console.log(groupTags);
	tempText = tempText + "]; [Offices: ";
	var tempCountOffices = groupTags.offices.length;
	for (i in groupTags.offices) {
		if (i == tempCountOffices - 1){
			tempText = tempText + groupTags.offices[i];
		} else {
			tempText = tempText + groupTags.offices[i] + ", ";
		}
	}

	document.title = titleSites;

	tempText = tempText + "]";
	$("#convo-header .panel-heading").text(tempText);
	document.title = tempText;
}

function displayDetailsForThread(siteabr){
	$.post('../chatterbox/getsitbangprovmun', {sites: siteabr}).done(function(response){
		var site_details = JSON.parse(response);
		for (i in site_details) {
			var site = site_details[i].sitio+", "+site_details[i].barangay+", "+site_details[i].municipality+", "+site_details[i].province+" <b>("+siteabr+")</b>";
			if ($("#convo-header .panel-body").html().split("<b>").length <= 3) {
				$("#convo-header .panel-body").append(site.replace("null,",""));
			} else {
				if ($("#convo-header .panel-body").html().split("glyphicon glyphicon-th-list").length != 2) {
					$("#convo-header .panel-body").append("&nbsp;&nbsp;<span class='glyphicon glyphicon glyphicon-th-list' data-toggle='tooltip' data-placement='bottom''></span>");
					$('#convo-header .panel-body span').attr('title',site)
				} else {
					var more_details = $('#convo-header .panel-body span').attr('title');
					$('#convo-header .panel-body span').attr('title',site.replace("null,","").replace("<b>","").replace("</b>","")+more_details);
				}
			}
		}
	});
}

function displayGroupTagsForDynaThread(tags) {
	var tempText = "[Team Tags: ";
	var titleSites = "";
	var tempCountTag = tags.length;
	for (i in tags) {
		if (i == tempCountTag - 1) {
			tempText = tempText + tags[i];
		} else {
			tempText = tempText + tags[i] + ", ";
		}
	}

	tempText = tempText + "]";
	$("#convo-header .panel-heading").text(tempText);
	document.title = tempText;

}

try {
	var comboplete = new Awesomplete('input.dropdown-input[data-multiple]', {
		filter: function(text, input) {
			return Awesomplete.FILTER_CONTAINS(text, input.match(/[^;]*$/)[0]);
		},

		replace: function(text) {
			var before = this.input.value.match(/^.+;\s*|/)[0];
			this.input.value = before + text + "; ";
		},
		minChars: 3
	});
	comboplete.list = [];

	Awesomplete.$('.dropdown-input').addEventListener("click", function() {
		var nameQuery = $('.dropdown-input').val();

		if (nameQuery.length >= 3) {
			if (comboplete.ul.childNodes.length === 0) {
				comboplete.evaluate();
			} 
			else if (comboplete.ul.hasAttribute('hidden')) {
				comboplete.open();
			}
			else {
				comboplete.close();
			}
		}
	});

	Awesomplete.$('.dropdown-input').addEventListener("keyup", function(e){
		var code = (e.keyCode || e.which);
		if(code == 37 || code == 38 || code == 39 || code == 40) {
			return;
		}

		var allNameQueries = $('.dropdown-input').val();
		var nameQuery = getFollowingNameQuery(allNameQueries);

		if (allNameQueries.length < 3) {
			multiContactsList = [];
			contactnumTrimmed = [];
		}

		if (nameQuery.length >= 3) {
			getNameSuggestions(nameQuery);

		}
		else {
			comboplete.close();
		}

	}, false);

	Awesomplete.$('.dropdown-input').addEventListener("awesomplete-selectcomplete", function(e){
		var allText = $('.dropdown-input').val();
		var size = allText.length;
		var allNameQueries = allText.slice(0, size-2);
		var nameQuery = getFollowingNameQuery(allNameQueries);

		parseContactInfo(nameQuery);
	}, false);
} catch(err) {
}

var qiFullContact = null;

$(document).on("click","#quick-inbox-display li,#quick-event-inbox-display li",function(){
	$('#chatterbox-loading').modal('show');
	$('input[name="offices"]').attr('checked', false);
	$('input[name="sitenames"]').attr('checked', false);
	quickInboxStartChat($(this).closest('li').find("input[type='text']").val());
});

$(document).on("click","#quick-inbox-unknown-display li",function(){
	$('#chatterbox-loading').modal('show');
	$('input[name="offices"]').attr('checked', false);
	$('input[name="sitenames"]').attr('checked', false);
	quickInboxStartChat($(this).closest('li').find("input[type='text']").val());
});

$(document).on("click","#quick-release-display li",function(){
	$('#chatterbox-loading').modal('show');
	counters = 0;
	convoFlagger = false;
	groupTags = [];

	user = "You";

	var tagOffices = ['LLMC','BLGU','MLGU','PLGU','REG8'];

	var tagSitenames = [];
	tagSitenames.push($(this).closest('li').find("input[type='text']").val().toUpperCase());
	$('input[name="sitenames"]').prop('checked',false);
	$('input[name="offices"]').prop('checked',false);
	$('input[name="opt-ewi-recipients"]').prop('checked',true);

	if (tagSitenames[0] == "MSL" || tagSitenames[0] == "MSU") {
			tagSitenames[0] = "MES";
	}

	$('input[name="sitenames"]:unchecked').each(function() {
		if (tagSitenames[0] == $(this).val()) {
			$(this).prop('checked',true);
		}
	});

	for (var counter = 0; counter < tagOffices.length; counter++) {
		$('input[name="offices"]:unchecked').each(function() {
			if (tagOffices[counter] == $(this).val()) {
				$(this).prop('checked',true);
			}
		});
	}

	groupTags = {
		'type': 'smsloadrequestgroup',
		'offices': tagOffices,
		'sitenames': tagSitenames
	};
	displayGroupTagsForThread();

	$('#user').val('You');
	$('#messages').html('');
	messages = [];
	contactInfo = "groups";
	conn.send(JSON.stringify(groupTags));
	$('#main-container').removeClass('hidden');
});

function quickInboxStartChat(fullContact=null) {

	if (fullContact == null) {
		console.log("Error: User or Name is null");
		return;
	}
	else {
		console.log("User: " + fullContact);
	}

	qiFullContact = fullContact;
	startChat(source="quickInbox");
}

function startChat(source="normal") {
	convoFlagger = false;
	counters = 0;

	user = "You";

	if (source == "normal") {
		if (contactSuggestions) {
			contactInfo = multiContactsList;
		}
		else {
			contactname = $('.dropdown-input').val();
			contactnum = contactname;
			contactnumTrimmed = [trimmedContactNum(contactnum)];

			contactInfo = [{'fullname':contactname,'numbers':contactnum}];
		}
	}
	else if (source == "quickInbox") {
		contactname = qiFullContact;
		contactnum = contactname;
		contactnumTrimmed = [trimmedContactNum(contactnum)];

		contactInfo = [{'fullname':contactname,'numbers':contactnum}];
	}
	displayContactNamesForThread(source);

	if (contactnumTrimmed <= 0) {
		alert("Error: Invalid Contact Number");
		return;
	}

	$('#user-container').addClass('hidden');
	$('#main-container').removeClass('hidden');

	var msgHistory = {
		'type': 'smsloadrequest',
		'number': contactnumTrimmed,
		'timestamp': moment().format('YYYY-MM-DD HH:mm:ss')
	};

	$('#user').val('You');
	$('#messages').html('');
	messages = [];

	tempRequest = msgHistory;
	conn.send(JSON.stringify(msgHistory));
}
$('#go-chat').click(function() {
	lastMessageTimeStamp = "";
	lastMessageTimeStampYou = "";
	tempTimestamp = "";
	tempTimestampYou = "";

	$('input[name="offices"]').prop('checked', false);
	$('input[name="sitenames"]').prop('checked', false);

	if (connection_status == false){
		console.log("NO CONNECTION");
	} else {
		startChat();
	}

});

var testMsg;
$('#send-msg').on('click',function(){
	if (connection_status == false){
		console.log("NO CONNECTION");
	} else {

		messages = [];
		counters = 0;
		ewi_filter = "";
		if (contactInfo == "groups") {
			var text = $('#msg').val();
			user = "You";

			if (quickGroupSelectionFlag == true) {
				var emp_tag = [];
				$('input[name="tag"]:checked').each(function() {
					emp_tag.push(this.value);
				});

				gsmTimestampIndicator = moment().format('YYYY-MM-DD HH:mm:ss');
				var msg = {
					'type': 'smssend',
					'user': user,
					'tag': emp_tag,
					'msg': text + footer,
					'timestamp': gsmTimestampIndicator,
					'ewi_tag': false
				};

				conn.send(JSON.stringify(msg));

				msgType = "smssendgroup";
				testMsg = msg;
				counters = 0;
				messages = [];
				updateMessages(msg);

				$('#msg').val('');
			} else {
				var tagOffices = [];
				$('input[name="offices"]:checked').each(function() {
					tagOffices.push(this.value);
				});

				var tagSitenames = [];
				$('input[name="sitenames"]:checked').each(function() {
					tagSitenames.push(this.value);
				});

				temp_msg_holder = {
					'type': 'smssendgroup',
					'user': user,
					'offices': tagOffices,
					'sitenames': tagSitenames,
					'msg': text + footer,
					'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
					'ewi_filter': $('input[name="opt-ewi-recipients"]:checked').val(),
					'ewi_tag': false
				};

				conn.send(JSON.stringify(temp_msg_holder));

				msgType = "smssendgroup";
				testMsg = msg;
				counters = 0;
				messages = [];
				$('#msg').val('');	
			}
		}
		else {
			var text = $('#msg').val();

			var normalized = [];
			for (i in contactnumTrimmed) {
				normalized[i] = normalizedContactNum(contactnumTrimmed[i]);
			}

			user = "You";
			gsmTimestampIndicator = moment().format('YYYY-MM-DD HH:mm:ss')
			temp_msg_holder = {
				'type': 'smssend',
				'user': user,
				'numbers': normalized,
				'msg': text + footer,
				'timestamp': gsmTimestampIndicator,
				'ewi_tag':false
			};
			console.log(temp_msg_holder);
			conn.send(JSON.stringify(temp_msg_holder));
			$('#msg').val('');
		}

		updateRemainingCharacters();
	}
});
function loadGroups(){
	if (quickGroupSelectionFlag == true) {
		$("#modal-select-sitenames").find(".checkbox").find("input").prop('checked', false);
		$("#modal-select-offices").find(".checkbox").find("input").prop('checked', false);
		loadGroupsEmployee();
	} else  if (quickGroupSelectionFlag == false) {
		$("#modal-select-grp-tags").find(".checkbox").find("input").prop('checked', false);
		loadGroupsCommunity();
	} else {
		alert('Something went wrong, Please contact the Administrator');
	}

}

function loadGroupsCommunity(){
	counters = 0;
	convoFlagger = false;
	groupTags = [];

	user = "You";

	var tagOffices = [];
	$('input[name="offices"]:checked').each(function() {
		tagOffices.push(this.value);
	});

	var tagSitenames = [];
	$('input[name="sitenames"]:checked').each(function() {
		tagSitenames.push(this.value);
	});
	tagSitenames.sort();

	groupTags = {
		'type': 'smsloadrequestgroup',
		'offices': tagOffices,
		'sitenames': tagSitenames
	};
	displayGroupTagsForThread();

	$('#user').val('You');
	$('#messages').html('');
	messages = [];
	contactInfo = "groups";
	conn.send(JSON.stringify(groupTags));
	$('#main-container').removeClass('hidden');
}

function loadGroupsEmployee(){
	var requestTag = [];

	var dynaTags = [];
	$('input[name="tag"]:checked').each(function() {
		dynaTags.push(this.value);
	});
	displayGroupTagsForDynaThread(dynaTags);

	$('#user').val('You');
	$('#messages').html('');
	messages = [];
	contactInfo = "groups";

	requestTag = {
		'type':'smsloadrequesttag',
		'teams': dynaTags
	}
	conn.send(JSON.stringify(requestTag));
	$('#main-container').removeClass('hidden');
}

$('#go-load-groups').click(function() {
	$('#chatterbox-loading').modal('show');
	groupTags = [];
	tempTimestampYou = "";
	tempTimestampGroup = "";
	lastMessageTimeStampYou = "";
	lastMessageTimeStamp = "";
	if (connection_status == false){
		console.log("NO CONNECTION");
	} else {
		loadGroups();
	}
});

$(document).ready(function() {
	var table = $('#response-contact-container').DataTable();
});

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

$('#response-contact-container').on('click', 'tr:has(td)', function(){
	var table = $('#response-contact-container').DataTable();
	var data = table.row(this).data();
	if (data[0].charAt(0) == "c") {
		reset_cc();
		var container = document.getElementById("community-contact-wrapper");
		var input = document.createElement("input");
		input.id = "c_id";
		input.value = data[0];
		console.log(data[0]);
		input.setAttribute('hidden',true);
		container.appendChild(input);
		$('#response-contact-container_wrapper').prop('hidden',true);
		$('#community-contact-wrapper').prop('hidden', false);
		$('#employee-contact-wrapper').prop('hidden', true);
		$('#firstname_cc').val(data[1]);
		$('#lastname_cc').val(data[2]);
		$('#prefix_cc').val(data[3]);
		$('#office_cc').val(data[4]);
		$('#sitename_cc').val(data[5]);
		$('#numbers_cc').val(data[6]);
		$('#rel_cc').val(data[7]);
		if (data[8] == "Yes") {
			$('#ewirecipient').val(1);
		} else {
			$('#ewirecipient').val(0);
		}

		var numbers = data[6].split(',');

		for(x = 0; x < numbers.length; x++) {
			$('#numbers_cc').tagsinput('add',numbers[x]);
		}
	} else {
		reset_ec();
		var container = document.getElementById("employee-contact-wrapper");
		var input = document.createElement("input");
		input.id = "eid";
		input.value = data[0];
		input.setAttribute('hidden',true);
		container.appendChild(input);
		$('#response-contact-container_wrapper').prop('hidden',true);
		$('#community-contact-wrapper').prop('hidden', true);
		$('#employee-contact-wrapper').prop('hidden', false);
		$('#firstname_ec').val(data[1]);
		$('#lastname_ec').val(data[2]);
		$('#nickname_ec').val(data[3]);
		$('#birthdate_ec').val(data[4]);
		$('#email_ec').val(data[5]);
		$('#numbers_ec').val(data[6]);
		$('#grouptags_ec').val(data[7]);

		var numbers = data[6].split(',');
		var grouptags = data[7].split(',');

		for(x = 0; x < numbers.length; x++) {
			$('#numbers_ec').tagsinput('add',numbers[x]);
		}

		for(y = 0;y < grouptags.length; y++) {
			$('#grouptags_ec').tagsinput('add',grouptags[y]);
		}
	}
});

$('#btn-contact-settings').click(function() {

	$('#employee-contact-wrapper').prop('hidden', true);
	$('#community-contact-wrapper').prop('hidden', true);
	$('#response-contact-container_wrapper').prop('hidden',true);
	$('#update-contact-container').prop('hidden',true);

	$('#contact-category option').prop('selected', function() {
		$('#contact-category').css("border-color", "#d6d6d6");
		$('#contact-category').css("background-color", "inherit");
		return this.defaultSelected;
	});

	$('#settings-cmd option').prop('selected', function() {
		$('#settings-cmd').prop('disabled',true);
		$('#settings-cmd').css("border-color", "#d6d6d6");
		$('#settings-cmd').css("background-color", "inherit");
		return this.defaultSelected;
	});

	$('#contact-result').remove();
	fetchSiteAndOffice();
});

function fetchSiteAndOffice(){
	$('#sitename_cc').empty();
	$('#office_cc').empty();
	$.ajax({
		type: "GET",
		url: "../chatterbox/getdistinctsitename",             
		dataType: "json",              
		success: function(response){
			var counter = 0;
			select = document.getElementById('sitename_cc');
			for (counter=0;counter < response.length;counter++){
				var opt = document.createElement('option');
				opt.value = response[counter].sitename;
				opt.innerHTML = response[counter].sitename;
				select.className = "form-control";
				select.setAttribute("required","true");
				select.appendChild(opt);
			}
			opt.value = "OTHERS";
			opt.innerHTML = "OTHERS";
			select.appendChild(opt);
		}
	});

	$.ajax({
		type: "GET",
		url: "../chatterbox/getdistinctofficename",             	
		dataType: "json",              
		success: function(response){
			var counter = 0;
			select = document.getElementById('office_cc');
			for (counter=0;counter < response.length;counter++){
				var opt = document.createElement('option');
				opt.value = response[counter].office;
				opt.innerHTML = response[counter].office;
				select.className = "form-control";
				select.setAttribute("required","true");
				select.appendChild(opt);
			}
			var opt = document.createElement('option');
			opt.value = "OTHERS";
			opt.innerHTML = "OTHERS";
			select.className = "form-control";
			select.setAttribute("required","true");
			select.appendChild(opt);
		}
	});
}

$('#sitename_cc').on('change',function() {
	if ($("#sitename_cc").val() == "OTHERS") {
		$("#other-sitename").show();
	} else {
		$("#other-sitename").hide();
	}
});

$('#office_cc').on('change',function() {
	if ($("#office_cc").val() == "OTHERS") {
		$("#other-officename").show();
	} else {
		$("#other-officename").hide();
	}
});
$('#btn-clear-ec').on('click',function(){
	if ($('#settings-cmd').val() == "updatecontact"){
		$('#employee-contact-wrapper').attr('hidden',true);
		getEmpContact();
	} else {
		reset_ec();
	}
});

function reset_ec() {
	$('#firstname_ec').val('');
	$('#lastname_ec').val('');
	$('#grouptags_ec').val('');
	$('#nickname_ec').val('');
	$('#email_ec').val('');
	$('#numbers_ec').val('');
	$('#grouptags_ec').val('');
	$('#numbers_ec').tagsinput("removeAll");
	$('#grouptags_ec').tagsinput("removeAll");
}
$('#btn-clear-cc').on('click',function(){
	if ($('#settings-cmd').val() == "updatecontact"){
		$('#community-contact-wrapper').attr('hidden',true);
		getComContact();
	} else {
		reset_cc();
	}
});

function reset_cc() {
	$('#firstname_cc').val('');
	$('#lastname_cc').val('');
	$('#prefix_cc').val('');
	$('#rel_cc').val('');
	$('#numbers_cc').val('');
	$('#numbers_cc').tagsinput("removeAll");
	$('#office_cc').val("LLMC");
	$('#sitename_cc').val("AGB");
	$('#rel').val("Y");
	$('#ewirecipient').val("1");

	$('#other-officename').val('');
	$('#other-sitename').val('');

	$('#other-officename').hide();
	$('#other-sitename').hide();
}

$('#alert_status').on('change',function(){
	$.post( "../chatterbox_beta/getAlertLevel", {alert_status: $(this).val()})
	.done(function(data) {
		var response = JSON.parse(data);
		$('#alert-lvl').empty();
		$('#internal-alert').empty();

		$('#alert-lvl').append($('<option>', { 
			value: "------------",
			text : "------------" 
		}));

		$('#internal-alert').append($('<option>', { 
			value: "------------",
			text : "------------" 
		}));

		for (var counter = 0; counter < response.length; counter++) {
			if (response[counter].alert_symbol_level.toLowerCase().indexOf('alert') > -1) {
				$('#alert-lvl').append($('<option>', { 
					value: response[counter].alert_symbol_level,
					text : response[counter].alert_symbol_level 
				}));
			} else {
				$('#internal-alert').append($('<option>', { 
					value: response[counter].alert_symbol_level,
					text : response[counter].alert_symbol_level 
				}));
			}
		}
	});
});

$('#btn-ewi').on('click',function(){
	$('#alert-lvl').empty();
	$('#sites').empty();
	$('#alert_status').empty();
	$('#alert_lvl').empty();
	$('#internal_alert').empty();

	$('#alert_status').append($('<option>', { 
		value: "------------",
		text : "------------" 
	}));

	$.ajax({
		type: "GET",
		url: "../chatterbox_beta/getAlertStatus",             	
		dataType: "json",
		success: function(response){
			$.each(response, function (i, response) {
				$('#alert_status').append($('<option>', { 
					value: response.alert_status,
					text : response.alert_status 
				}));
			});
		}
	});

	$.ajax({
		type: "GET",
		url: "../chatterbox/getdistinctsitename",             
		dataType: "json",              
		success: function(response){
			var counter = 0;
			select = document.getElementById('sites');
			for (counter=0;counter < response.length;counter++){
				var opt = document.createElement('option');
				opt.value = response[counter].sitename;
				opt.innerHTML = response[counter].sitename;
				select.className = "form-control";
				select.setAttribute("required","true");
				select.appendChild(opt);
			}
			opt.value = "NSS";
			opt.innerHTML = "NO SITE SELECTED";
			select.className = "form-control";
			select.setAttribute("required","true");
			select.appendChild(opt);

			var counter = 0;
			$('input[name="sitenames"]:checked').each(function() {
				counter++;
			});

			if (counter == 1){
				$('select option[value="'+$('input[name="sitenames"]:checked').val()+'"]').attr("selected",true);
			} else {
				$('select option[value="NSS"]').attr("selected",true);
			}
		}
	});
});

$('#confirm-ewi').click(function(){
	if ($('#ewi-date-picker input').val() == "" || $('#sites').val() == "") {
		alert('Invalid input, All fields must be filled');
	} else {
		$.post( "../chatterbox/getsitbangprovmun", {sites: $('#sites').val()})
		.done(function(response) {
			var location = JSON.parse(response);
			var toTemplate = {
				'name': $('#sites').val(),
				'internal_alert' : $('#internal-alert').val() == "------------" ? "N/A" : $('#internal-alert').val(),
				'alert_level' : $('#alert-lvl').val() == "------------" ? "N/A" : $('#alert-lvl').val(),
				'alert_status' : $('#alert_status').val() == "------------" ? "N/A" : $('#alert_status').val(),
				'sitio':location[0].sitio == null ? "" : location[0].sitio,
				'barangay':location[0].barangay == null ? "" :location[0].barangay,
				'municipality':location[0].municipality == null ? "" : location[0].municipality,
				'province':location[0].province == null ? "" :location[0].province,
				'data_timestamp': $('#ewi-date-picker input').val()
			}
			sendViaAlertMonitor(toTemplate)
		});
	}
});

function getEWI(handledTemplate){
	var constructedEWI = "";
	var dateReplaced = "";
	$.ajax({
		type: "GET",
		url: "../chatterbox/getewi",             	
		dataType: "json",	
		success: function(response){
			var d = new Date();
			var currentPanahon = d.getHours();
			if (currentPanahon >= 12 && currentPanahon <= 18) {
				constructedEWI = response[$('#alert-lvl').val().toUpperCase()].replace("%%PANAHON%%","hapon");
			} else if (currentPanahon > 18 && currentPanahon <=23) {
				constructedEWI = response[$('#alert-lvl').val().toUpperCase()].replace("%%PANAHON%%","gabi");
			} else {
				constructedEWI = response[$('#alert-lvl').val().toUpperCase()].replace("%%PANAHON%%","umaga");
			}
			var year = $('#ewi-date-picker').val().substring(0, 4);
			var month = $('#ewi-date-picker').val().substring(5, 7);
			var day = $('#ewi-date-picker').val().substring(8, 10);

			var months = {1: "January",2: "February",3: "March",
			4: "April",5: "May",6: "June",
			7: "July",8: "August", 9: "September",
			10: "October", 11: "November", 12: "December"};

			var reconstructedDate = day+" "+months[parseInt(month)]+" "+year;
			dateReplaced = constructedEWI.replace("%%DATE%%",reconstructedDate);
			handledTemplate(dateReplaced);
		}
	});
}

function setEWILocation(consEWI){
	var finalEWI = "";
	if (consEWI != "") {
		$.post( "../chatterbox/getsitbangprovmun", {sites: $('#sites').val()})
		.done(function(response) {
			var location = JSON.parse(response);
			var sbmp = location[0].sitio + ", " +  location[0].barangay + ", " + location[0].municipality + ", " + location[0].province;
			var formatSbmp = sbmp.replace("null","");
			if (formatSbmp.charAt(0) == ",") {
				formatSbmp = formatSbmp.substr(1);
			}
			finalEWI = consEWI.replace("%%SBMP%%",formatSbmp);
			$('#msg').val(finalEWI);
		});
	} else {
		$('#msg').val("Site is not available");
	}
}

$('#ewi-date-picker').datetimepicker({
	locale: 'en',
	format: 'YYYY-MM-DD HH:mm:ss'
});

$('#edit-btn-ewi-amd').click(function(){
	if ($('#edit-btn-ewi-amd').val() === "edit"){
		$('#constructed-ewi-amd').prop("disabled", false );
		$('#edit-btn-ewi-amd').val("undo");
		$('#edit-btn-ewi-amd').text("Undo");
		$("#edit-btn-ewi-amd").attr('class', 'btn btn-danger');
	} else {
		$('#constructed-ewi-amd').prop("disabled", true );
		$('#constructed-ewi-amd').val(temp_ewi_template_holder);
		$("#edit-btn-ewi-amd").attr('class', 'btn btn-warning');
		$('#edit-btn-ewi-amd').text("Edit");
		$('#edit-btn-ewi-amd').val("edit");
	}
});

$("#ewi-asap-modal").on('shown.bs.modal', function(){
	temp_ewi_template_holder = $("#constructed-ewi-amd").val();
});

$('#btn-ewi').on('click',function(){
	$('#early-warning-modal').modal('toggle');
});

$('#send-btn-ewi-amd').click(function(){
	var current_recipients = $('#ewi-recipients-dashboard').tagsinput('items');
	var default_recipients = $('#default-recipients').val().split(',');
	var difference = [];

	$.grep(current_recipients, function(el) {
		if ($.inArray(el, default_recipients) == -1) difference.push(el);
	});

	ewiFlagger = true;
	var footer = " -"+$('#footer-ewi').val()+" from PHIVOLCS-DYNASLOPE";
	var text = $('#constructed-ewi-amd').val();
	if (temp_ewi_template_holder == $('#constructed-ewi-amd').val()) {
		$('#edit-btn-ewi-amd').val('edit');
	}

	try {
		var tagOffices = ['LLMC','BLGU','MLGU','PLGU','REG8'];

		$('input[name="offices"]').prop('checked', false);
		$('input[name="sitenames"]').prop('checked', false);

		var tagSitenames = [];
		tagSitenames.push($('#site-abbr').val().toUpperCase());

		switch(tagSitenames[0]) {
			case "MSL":
			tagSitenames[0] = "MES";
			break;
			case "MSU":
			tagSitenames[0] = "MES";
			break;
		}

		var msg = {
			'type': 'smssendgroup',
			'user': 'You',
			'offices': tagOffices,
			'sitenames': tagSitenames,
			'msg': text+footer,
			'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
			'ewi_filter': true,
			'ewi_tag': true
		};

		conn.send(JSON.stringify(msg));
		msgType = "smssendgroup";
		messages = [];
		updateMessages(msg);

		if (difference != null || difference.length != 0) {
			var added_contacts = [];
			difference.forEach(function(x){
				if (x.indexOf("|") == -1) {
					added_contacts.push([x]);
				} else {
					var temp = x.split('|');
					added_contacts.push(temp.splice(1,1));
				}
			});

			for (var counter = 0; counter < added_contacts.length;counter++) {
				user = "You";
				gsmTimestampIndicator = moment().format('YYYY-MM-DD HH:mm:ss')
				temp_msg_holder = {
					'type': 'smssend',
					'user': user,
					'numbers': added_contacts[counter],
					'msg': text + footer,
					'timestamp': gsmTimestampIndicator,
					'ewi_tag':true
				};
				conn.send(JSON.stringify(temp_msg_holder));
			}
		}

		$('#constructed-ewi-amd').val('');
		$('#result-ewi-message').text('Early Warning Information sent successfully!');
		$('#success-ewi-modal').modal('toggle');
		$('#ewi-asap-modal').modal('toggle');
		$("#" + latest_release_id + "_sms").css("color", "red").attr("data-sent", 1);
	} catch(err) {
		$('#result-ewi-message').text('Failed!, Please check the template.');
		alert(err.stack);
		$('#success-ewi-modal').modal('toggle');
		$('#ewi-asap-modal').modal('toggle');
	}
});

$('#sbt-update-contact-info').click(function(){
	$('#edit-contact').modal('toggle');
});
$('#checkAllOffices').click(function() {
	$("#modal-select-offices").find(".checkbox").find("input").prop('checked', true);
});
$('#uncheckAllOffices').click(function() {
	$("#modal-select-offices").find(".checkbox").find("input").prop('checked', false);
});
$('#checkAllTags').click(function() {
	$("#modal-select-grp-tags").find(".checkbox").find("input").prop('checked', true);
});
$('#uncheckAllTags').click(function() {
	$("#modal-select-grp-tags").find(".checkbox").find("input").prop('checked', false);
});
$('#checkAllSitenames').click(function() {
	$("#modal-select-sitenames").find(".checkbox").find("input").prop('checked', true);
});
$('#uncheckAllSitenames').click(function() {
	$("#modal-select-sitenames").find(".checkbox").find("input").prop('checked', false);
});

$('#btn-gbl-search').click(function(){
	if (connection_status == false){
		console.log("NO CONNECTION");
	} else {
		$('#search-global-message-modal').modal("toggle");
		searchResults = [];
		counter = 0;
		$('#search-global-keyword').val('');
	}
});
$('#msg').bind('input propertychange', function() {
	updateRemainingCharacters();
});

$('#btn-contact-settings').click(function(){
	if (connection_status == false){
		console.log("NO CONNECTION");
	} else {
		$('#contact-settings').modal("toggle");
	}
});

$('#btn-advanced-search').click(function(){
	if (connection_status == false){
		console.log("NO CONNECTION");
	} else {
		$('#advanced-search').modal("toggle");
	}
});

var isFirstAdvancedSearchActivation = false;

function disableCommands(){
}

function enableCommands(){
}

function getOfficesAndSitenames () {
	try {
		var msg = {
			'type': 'loadofficeandsitesrequest'
		};
		conn.send(JSON.stringify(msg));
	} catch(err) {
	}
}

function getInitialQuickInboxMessages () {
	var msg = {
		'type': 'smsloadquickinboxrequest'
	};
	conn.send(JSON.stringify(msg));
}

function getLatestAlert() {
	var msg = {
		'type' : 'latestAlerts'
	};
	conn.send(JSON.stringify(msg));
}


$('a[href="#emp-group"]').on('click',function(){
	employeeTags = [];
	$.get( "../chatterbox/getEmployeeTags", function( data ) {
		var dataFetched = JSON.parse(data);
		for (var x = 0;x< dataFetched.length;x++){
			var parts = dataFetched[x].grouptags.split(/[ ,.]+/); 
			if (employeeTags.length <= 0) {
				for (var y = 0; y < parts.length; y++){
					employeeTags.push(parts[y]);
				}
			} else {
				for (var y = 0;y < parts.length;y++){
					if (!(employeeTags.indexOf(parts[y]) > -1)) {
						employeeTags.push(parts[y]);
					}
				}
			}
		}
		loadEmployeeTags(employeeTags);
	});
});

$('#emp-grp-flag').on('click',function(){
	quickGroupSelectionFlag = true;
});

$('#comm-grp-flag').on('click',function(){
	quickGroupSelectionFlag = false;
});


function loadEmployeeTags(tags) {
	for (var x = 0;x < 6;x++) {
		var myNode = document.getElementById("tag-"+x);
		while (myNode.firstChild) {
			myNode.removeChild(myNode.firstChild);
		}
	}

	for (var i = 0; i < tags.length; i++) {
		var modIndex = i % 4;
		var tag = tags[i];
		if (tag != "" || tag != null) {
			$("#tag-"+modIndex).append('<div class="checkbox"><label><input name="tag" type="checkbox" value="'+tag+'">'+tag.toUpperCase()+'</label></div>');
		}	
	}
}

$('#contact-category').on('change',function(){
	$('#contact-result').remove();
	if ($('#contact-category').val() != 'default') {
		$('#contact-category').css("border-color", "#3c763d");
		$('#contact-category').css("background-color", "#dff0d8");
	}
	$('#settings-cmd').prop('disabled', false);
	$('#settings-cmd option').prop('selected', function() {
		$('#settings-cmd').css("border-color", "#d6d6d6");
		$('#settings-cmd').css("background-color", "inherit");
		return this.defaultSelected;
	});

	reset_cc();
	reset_ec();

	$('#update-contact-container').prop('hidden',true);
	$('#response-contact-container_wrapper').prop('hidden',true);
	$('#employee-contact-wrapper').prop('hidden', true);
	$('#community-contact-wrapper').prop('hidden', true);
});

$('#settings-cmd').on('change',function(){

	reset_cc();
	reset_ec();


	if ($('#settings-cmd').val() != 'default') {
		$('#settings-cmd').css("border-color", "#3c763d");
		$('#settings-cmd').css("background-color", "#dff0d8");
	}

	if ($('#contact-category').val() == "econtacts") {
		if ($('#settings-cmd').val() == "addcontact") {
			$('#response-contact-container_wrapper').prop('hidden',true);
			$('#community-contact-wrapper').prop('hidden', true);
			$('#employee-contact-wrapper').prop('hidden', false);
		} else if ($('#settings-cmd').val() == "updatecontact") {
			$('#employee-contact-wrapper').prop('hidden', true);
			$('#community-contact-wrapper').prop('hidden', true);
			reset_cc();
			reset_ec();
			getEmpContact();
		} else {
			console.log('Invalid Request');
		}
	} else if ($('#contact-category').val() == "ccontacts") {
		if ($('#settings-cmd').val() == "addcontact") {
			$('#response-contact-container_wrapper').prop('hidden',true);
			$('#employee-contact-wrapper').prop('hidden', true);
			$('#community-contact-wrapper').prop('hidden', false);
		} else if ($('#settings-cmd').val() == "updatecontact") {	
			reset_cc();
			reset_ec();
			$('#employee-contact-wrapper').prop('hidden', true);
			$('#community-contact-wrapper').prop('hidden', true);
			getComContact();
		} else {
			console.log('Invalid Request');
		}
	} else {
		console.log('Invalid Request');
	}
});

function getComContact(){
	var table = $('#response-contact-container').DataTable();
	$.ajax({
		type: "GET",
		url: "../chatterbox/get_community_contacts",      
		success: function(response){
			var data = JSON.parse(response);
			console.log(data);

			$("#response-contact-container").DataTable().clear();
			$("#response-contact-container").DataTable().destroy();

			$('thead tr th').remove();
			$('thead tr').append( $('<th />', {text : 'c_id'}).css("display", "none"));
			$('thead tr').append( $('<th />', {text : 'First name'}));
			$('thead tr').append( $('<th />', {text : 'Last name'}));
			$('thead tr').append( $('<th />', {text : 'Prefix'}));
			$('thead tr').append( $('<th />', {text : 'Office'}));
			$('thead tr').append( $('<th />', {text : 'Sitename'}));
			$('thead tr').append( $('<th />', {text : 'Contact #'}));
			$('thead tr').append( $('<th />', {text : 'Rel'}));
			$('thead tr').append( $('<th />', {text : 'EWI Recipient'}));

			$('tfoot tr th').remove();
			$('tfoot tr').append( $('<th />', {text : 'c_id'}).css("display", "none"));
			$('tfoot tr').append( $('<th />', {text : 'First name'}));
			$('tfoot tr').append( $('<th />', {text : 'Last name'}));
			$('tfoot tr').append( $('<th />', {text : 'Prefix'}));
			$('tfoot tr').append( $('<th />', {text : 'Office'}));
			$('tfoot tr').append( $('<th />', {text : 'Sitename'}));
			$('tfoot tr').append( $('<th />', {text : 'Contact #'}));
			$('tfoot tr').append( $('<th />', {text : 'Rel'}));
			$('tfoot tr').append( $('<th />', {text : 'EWI Recipient'}));

			for (var i = 0; i < data.length; i++) {
				var ewi_flag = "";
				if (data[i].ewirecipient == true) {
					ewi_flag = "Yes";
				} else {
					ewi_flag = "No";
				}
				var newContent = "<tr><td style='display:none;'>c_"+data[i].c_id+"</td><td>"+data[i].firstname+"</td><td>"+data[i].lastname+"</td><td>"+data[i].prefix+"</td><td>"+data[i].office+"</td><td>"+data[i].sitename+"</td><td>"+data[i].number+"</td><td>"+data[i].rel+"</td><td>"+ewi_flag+"</td></tr>";
				$("#response-contact-container tbody").append(newContent);
			}


			$('#response-contact-container').show();
			$("#response-contact-container").DataTable({
				"scrollX": true
			});
		}
	});
}

function getEmpContact(){
	var table = $('#response-contact-container').DataTable();
	$.ajax({
		type: "GET",
		url: "../chatterbox/get_employee_contacts",        
		success: function(response){
			var data = JSON.parse(response);
			console.log(data);
			$("#response-contact-container").DataTable().clear();
			$("#response-contact-container").DataTable().destroy();

			$('thead tr th').remove();
			$('thead tr').append( $('<th />', {text : 'eid'}).css("display", "none"));
			$('thead tr').append( $('<th />', {text : 'First name'}));
			$('thead tr').append( $('<th />', {text : 'Last name'}));
			$('thead tr').append( $('<th />', {text : 'Nickname'}));
			$('thead tr').append( $('<th />', {text : 'Birthdate'}));
			$('thead tr').append( $('<th />', {text : 'Email'}));
			$('thead tr').append( $('<th />', {text : 'Contact #'}));
			$('thead tr').append( $('<th />', {text : 'Group Tags'}));

			$('tfoot tr th').remove();
			$('tfoot tr').append( $('<th />', {text : 'eid'}).css("display", "none"));
			$('tfoot tr').append( $('<th />', {text : 'First name'}));
			$('tfoot tr').append( $('<th />', {text : 'Last name'}));
			$('tfoot tr').append( $('<th />', {text : 'Nickname'}));
			$('tfoot tr').append( $('<th />', {text : 'Birthdate'}));
			$('tfoot tr').append( $('<th />', {text : 'Email'}));
			$('tfoot tr').append( $('<th />', {text : 'Contact #'}));
			$('tfoot tr').append( $('<th />', {text : 'Group Tags'}));

			for (var i = 0; i < data.length; i++) {
				var newContent = "<tr><td style='display:none;'>e_"+data[i].eid+"</td><td>"+data[i].firstname+"</td><td>"+data[i].lastname+"</td><td>"+data[i].nickname+"</td><td>"+data[i].birthday+"</td><td>"+data[i].email+"</td><td>"+data[i].numbers+"</td><td>"+data[i].grouptags+"</td></tr>";
				$("#response-contact-container tbody").append(newContent);
			}

			$('#response-contact-container').show();
			$("#response-contact-container").DataTable({
				"scrollX": true
			});
		}
	});
}

$('#comm-settings-cmd button[type="submit"]').on('click',function(){
	if ($('#settings-cmd').val() != "updatecontact") {
		var empty_fields = 0;
		$('#community-contact-wrapper input').each(function(){
			if (($(this).val() == "" || $(this).val() == null) && $(this).attr('id') != undefined) {
				empty_fields++;
			}
		});

		if (empty_fields > 2) {
			$('#contact-result').remove();
			var container = document.getElementById('community-contact-wrapper');
			var resContainer = document.createElement('div');
			resContainer.id = "contact-result";
			resContainer.className = "alert alert-danger";
			resContainer.innerHTML = "<strong>Failed!</strong> All fields must be filled up.";
			container.insertBefore(resContainer,container.childNodes[0]);
		} else {
			if ($('#sitename_cc').val() == "OTHERS") {
				$site = $('#other-sitename').val();
			} else {
				$site = $('#sitename_cc').val();
			}

			if ($('#office_cc').val() == "OTHERS") {
				$office = $('#other-officename').val();
			} else {
				$office = $('#office_cc').val();
			}

			data = {
				'category': 'communitycontacts',
				'c_id': '',
				'lastname': $('#lastname_cc').val(),
				'firstname': $('#firstname_cc').val(),
				'prefix': $('#prefix_cc').val(),
				'office': $office,
				'sitename': $site,
				'number': $('#numbers_cc').val(),
				'rel': $('#rel').val(),
				'ewirecipient': ($('#ewirecipient').val() == 1 ? true : false)
			};

			$.post( "../communications/chatterbox/addcontact", {contact: JSON.stringify(data)})
			.done(function(response) {
				if (response == true) {
					$('#contact-result').remove();
					$.notify('Success! New community contact added.','success');
					$('#community-contact-wrapper').prop('hidden', true);
					getComContact();
					$("#employee-contact-wrapper input").val('');
				} else {
					$('#contact-result').remove();
					var container = document.getElementById('community-contact-wrapper');
					var resContainer = document.createElement('div');
					resContainer.id = "contact-result";
					resContainer.className = "alert alert-danger";
					resContainer.innerHTML = "<strong>Failed!</strong> Duplicate Entry / Invalid input data";
					container.insertBefore(resContainer,container.childNodes[0]);
				}
				reset_cc();
				fetchSiteAndOffice();
			});
		}
	} else {
		var empty_fields = 0;
		$('#community-contact-wrapper input').each(function(){
			if (($(this).val() == "" || $(this).val() == null) && $(this).attr('id') != undefined) {

				if (($(this).attr('id') == "other-officename" && $(this).val() == "") || ($(this).attr('id') == "other-sitename" && $(this).val() == "")) {
					console.log($(this).attr('id'));
				} else {
					empty_fields++;
				}
			}
		});

		if (empty_fields > 0) {
			$('#contact-result').remove();
			var container = document.getElementById('community-contact-wrapper');
			var resContainer = document.createElement('div');
			resContainer.id = "contact-result";
			resContainer.className = "alert alert-danger";
			resContainer.innerHTML = "<strong>Failed!</strong> All fields must be filled up.";
			container.insertBefore(resContainer,container.childNodes[0]);
		} else {
			if (confirm('The Changes you made will be saved. \n Do you want to proceed?')) {
				data = {
					'id': $('#c_id').val(),
					'firstname': $('#firstname_cc').val(),
					'lastname': $('#lastname_cc').val(),
					'prefix': $('#prefix_cc').val(),
					'office': $('#office_cc').val(),
					'sitename': $('#sitename_cc').val(),
					'number': $('#numbers_cc').val(),
					'rel': $('#rel').val(),
					'ewirecipient': $('#ewirecipient').val()
				};
				updateContactService(data,"community-contact-wrapper");
			}
		}
	}
});

$('#emp-settings-cmd button[type="submit"]').on('click',function(){
	if ($('#settings-cmd').val() != "updatecontact") {
		var empty_fields = 0;
		$('#employee-contact-wrapper input').each(function(){
			if (($(this).val() == "" || $(this).val() == null) && $(this).attr('id') != undefined) {
				empty_fields++;
			}
		});

		if (empty_fields > 0) {
			$('#contact-result').remove();
			var container = document.getElementById('employee-contact-wrapper');
			var resContainer = document.createElement('div');
			resContainer.id = "contact-result";
			resContainer.className = "alert alert-danger";
			resContainer.innerHTML = "<strong>Failed!</strong> All fields must be filled up.";
			container.insertBefore(resContainer,container.childNodes[0]);
		} else {
			data = {
				'category': 'dewslcontacts',
				'eid': '',
				'lastname': $('#lastname_ec').val(),
				'firstname': $('#firstname_ec').val(),
				'nickname': $('#nickname_ec').val(),
				'birthday': $('#birthdate_ec').val(),
				'email': $('#email_ec').val(),
				'numbers': $('#numbers_ec').val(),
				'grouptags': $('#grouptags_ec').val()
			};
			$.post( "../communications/chatterbox/addcontact", {contact: JSON.stringify(data)})
			.done(function(response) {
				console.log(response);
				if (response == true) {
					$('#contact-result').remove();
					$('#employee-contact-wrapper').prop('hidden',true);
					$.notify('Success! New employee contact added.','success');
					getEmpContact();
					$("#employee-contact-wrapper input").val('');
				} else {
					$('#contact-result').remove();
					var container = document.getElementById('employee-contact-wrapper');
					var resContainer = document.createElement('div');
					resContainer.id = "contact-result";
					resContainer.className = "alert alert-danger";
					resContainer.innerHTML = "<strong>Failed!</strong> Duplicate Entry / Invalid input data";
					container.insertBefore(resContainer,container.childNodes[0]);
				}
				reset_ec();
			});
		}
	} else {
		var empty_fields = 0;
		$('#employee-contact-wrapper input').each(function(){
			if (($(this).val() == "" || $(this).val() == null) && $(this).attr('id') != undefined) {
				empty_fields++;
			}
		});

		if (empty_fields > 0) {
			$('#contact-result').remove();
			var container = document.getElementById('employee-contact-wrapper');
			var resContainer = document.createElement('div');
			resContainer.id = "contact-result";
			resContainer.className = "alert alert-danger";
			resContainer.innerHTML = "<strong>Failed!</strong> All fields must be filled up.";
			container.insertBefore(resContainer,container.childNodes[0]);
		} else {
			if (confirm('The Changes you made will be saved. \n Do you want to proceed?')) {
				data = {
					'id': $('#eid').val(), 
					'firstname': $('#firstname_ec').val(),
					'lastname': $('#lastname_ec').val(),
					'nickname': $('#nickname_ec').val(),
					'birthdate': $('#birthdate_ec').val(),
					'email': $('#email_ec').val(),
					'numbers': $('#numbers_ec').val(),
					'grouptags': $('#grouptags_ec').val()
				};
				updateContactService(data,"employee-contact-wrapper");
			}
		}
	}
});

var message_li_index;
$(document).on("click","#messages li",function(){
	message_li_index = $(this).index();
	gintags_msg_details = ($(this).closest('li')).find("input[id='msg_details']").val().split('<split>');
	current_gintags = getGintagService(gintags_msg_details[5]);
	$('#gintag-modal').modal('toggle');
	$('.bootstrap-tagsinput').prop("disabled", true );
});

$('#gintags').on('beforeItemAdd', function(event) {
	if (gintags_msg_details[1] === "You") {
		if (event.item === "#EwiResponse" || event.item === "#GroundMeas") {
			console.log("Cannot add EwiResponse Tag for this message");
			event.cancel = true;
			$.notify("You cannot tag "+event.item+" if you are the sender","error");
		}
	} else {
		if (event.item === "#EwiMessage" || event.item === "#GroundMeasReminder") {
			console.log("Cannot add EwiMessage Tag for this message");
			event.cancel = true;
			$.notify("You cannot tag "+event.item+" if you are the recipient","error");
		}
	}
});

$('#confirm-gintags').click(function(){
	var tags = holdTags.split(',');
	var current_tags = $('#gintags').val().split(','); if(current_tags.length == 1 && current_tags[0] == 0) {current_tags = []};
	var diff = "";
	$('#gintag-modal').modal('toggle');
	if (tags.length > current_tags.length) {
		diff = $(tags).not(current_tags).get();
		removeGintagService(gintags_msg_details,diff);
	} else if (tags.length < current_tags.length){
		diff = $(tags).not(current_tags).get();
		insertGintagService(gintags_msg_details);
	} else {
		insertGintagService(gintags_msg_details);
	}
});

$('#gintags').tagsinput({
	typeahead: {
		displayKey: 'text',
		source: function (query) {
			var tagname_collection = [];
			$.ajax({
				url : "../../../gintagshelper/getAllGinTags",
				type : "GET",
				async: false,
				success : function(data) {
					var data = JSON.parse(data);
					for (var counter = 0; counter < data.length; counter ++) {
						tagname_collection.push(data[counter].tag_name);
					}
				}
			});
			return tagname_collection;
		}
	} 
});

$('#grouptags_ec').tagsinput({
	typeahead: {
		displayKey: 'text',
		source: function (query) {
			var group_tag = [];
			$.ajax({
				url : "../chatterbox/get_employee_contacts",
				type : "GET",
				async: false,
				success : function(data) {
					var data = JSON.parse(data);
					for (var counter = 0; counter < data.length; counter ++) {
						var raw_grouptags = data[counter].grouptags.split(",");
						for (var raw_counter = 0; raw_counter < raw_grouptags.length; raw_counter++) {
							if ($.inArray(raw_grouptags[raw_counter],group_tag) == -1) {
								group_tag.push(raw_grouptags[raw_counter]);
							}
						}
					}
				}
			});
			return group_tag;
		}
	} 
});

function removeGintagService(data,tags){
	var tagOffices = [];
	$('input[name="offices"]:checked').each(function() {
		tagOffices.push(this.value);
	});

	var tagSitenames = [];
	$('input[name="sitenames"]:checked').each(function() {
		tagSitenames.push(this.value);
	});

	if (tagOffices.length != 0 && tagSitenames.length != 0) {
		if (data[1] == "You") {
			var gintag_details = {
				"office" : tagOffices,
				"site": tagSitenames,
				"data": data,
				"cmd": "delete",
				"tags": tags
			};
			getGintagGroupContacts(gintag_details);
		} else {
			var gintag_details = {
				"data": data,
				"cmd": "delete",
				"tags": tags
			};
			getGintagGroupContacts(gintag_details);
		}
	} else {
		var db_used = "";
		if (data[1] == "You") {
			db_used = "smsoutbox";
		} else {
			db_used = "smsinbox";
		}
		var gintag_details = {
			"data": data,
			"tags": tags,
			"db_used": db_used
		};
		removeIndividualGintag(gintag_details);
	}
}


$("#confirm-narrative").on('click',function(){
	var data = JSON.parse($('#gintag_details_container').val());
	$('#gintags').val(data.tags);
	var tagSitenames = [];
	var tags = $('#gintags').val();
	tags = tags.split(',');

	$('input[name="sitenames"]:checked').each(function() {
		tagSitenames.push(this.value);
	});

	if (tagSitenames.length == 0 ) {
		var contactIdentifier = $('#contact-indicator').val().split(" ");
		tagSitenames.push(contactIdentifier[0]);
	}

	gintags_msg_details.tags = data.tags;
	if (data.tags == "#EwiMessage" || data.tags == "#GroundMeasReminder") {
		getGintagGroupContacts(data);
		for (var counter = 0; counter < tags.length; counter++) {
			if (tags[counter] == "#EwiMessage" || tags[counter] == "#GroundMeasReminder") {
				for (var tag_counter = 0; tag_counter < tagSitenames.length;tag_counter++) {
					if (tagSitenames[tag_counter] == "MES") {
						var mes_sites = ['MSL','MSU'];
						for (var msl_msu_counter = 0; msl_msu_counter < 2; msl_msu_counter++) {
							getOngoingEvents(mes_sites[msl_msu_counter]);
						}
					} else {
						getOngoingEvents(tagSitenames[tag_counter]);
					}
				}
				break;
			}
		}
	} else if (data.tags == "#EwiResponse" || data.tags == "#GroundMeas") {
		if (tags[1] != "") {
			for (var i = 0; i < tags.length;i++) {
				gintags_collection = [];
				gintags = {
					'tag_name': tags[i],
					'tag_description': "communications",
					'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
					'tagger': tagger_user_id,
					'table_element_id': data.data[5],
					'table_used': data.data[6],
					'remarks': ""
				}
				gintags_collection.push(gintags);
				$.post( "../generalinformation/insertGinTags/", {gintags: gintags_collection})
				.done(function(response) {
					$( "#messages li" ).eq(message_li_index).addClass("tagged");
				});
			}
			$.notify("GINTAG successfully tagged!","success");
		}
		for (var counter = 0; counter < tags.length;counter++) {
			if (tags[counter] == "#EwiResponse" || tags[counter] == "#GroundMeas") {
				for (var tag_counter = 0; tag_counter < tagSitenames.length;tag_counter++) {
					if (tagSitenames[tag_counter] == "MES") {
						var mes_sites = ['MSL','MSU'];
						for (var msl_msu_counter = 0; msl_msu_counter < 2; msl_msu_counter++) {
							getOngoingEvents(mes_sites[msl_msu_counter]);
						}
					} else {
						getOngoingEvents(tagSitenames[tag_counter]);
					}
				}
				break;
			}
		}
	} else {
		$.notify('Invalid Request, please try again.',"warning");
	}
});

function displayNarrativeConfirmation(gintag_details){
	if (gintag_details.data[1] == "You") {
		var summary = "";
		var office = "Office(s): ";
		var site = "Site(s): ";
		for (var counter = 0; counter < gintag_details.office.length; counter++) {
			office = office+gintag_details.office[counter]+" ";
		}

		for (var counter = 0; counter < gintag_details.site.length; counter++) {
			site = site+gintag_details.site[counter]+" ";
		}

		summary = office+"\n"+site+"\n\n"+gintag_details.data[4];
		console.log(gintag_details.data);
		$('#save-narrative-content p').text("Saving an "+tag_indicator+" tagged message will be saved to narratives.");
		$('#ewi-tagged-msg').val(summary);
	} else {
		var summary = "";
		var sender = "Sender(s): "+gintag_details.data[1];
		summary = sender+"\n\n"+gintag_details.data[4];
		console.log(gintag_details.data);
		$('#save-narrative-content p').text("Saving an "+tag_indicator+" tagged message will be saved to narratives.");
		$('#ewi-tagged-msg').val(summary);
	}
	$('#save-narrative-modal').modal('toggle');
}

function insertGintagService(data){
	var tags = $('#gintags').val();
	var gintags;
	var gintags_collection = [];
	tags = tags.split(',');

	var tagOffices = [];
	$('input[name="offices"]:checked').each(function() {
		tagOffices.push(this.value);
	});

	var tagSitenames = [];
	$('input[name="sitenames"]:checked').each(function() {
		tagSitenames.push(this.value);
	});

	if  (tagOffices.length == 0 && tagSitenames.length == 0) {
		tagOffices = [];
		tagSitenames = [];
		var contactIdentifier = $('#contact-indicator').val().split(" ");
		tagOffices.push(contactIdentifier[1]);
		tagSitenames.push(contactIdentifier[0]);
	}
	// if (tagOffices.length != 0 && tagSitenames.length != 0) {
		if (data[1] == "You") {
			var gintag_details = {
				"office" : tagOffices,
				"site": tagSitenames,
				"data": data,
				"cmd": "insert"
			};
			if ($.inArray("#EwiMessage",tags) != -1) {
				tag_indicator = "#EwiMessage";
			} else if ($.inArray('#GroundMeasReminder',tags) != -1) {
				tag_indicator = "#GroundMeasReminder";
			}

			if ($.inArray("#EwiMessage", tags) != -1 || $.inArray('#GroundMeasReminder',tags) != -1) {
				var tags = $('#gintags').val();
				tags = tags.split(',');
				tags.splice($.inArray(tag_indicator, tags),1);
				$('#gintags').val(tags);
				getGintagGroupContacts(gintag_details);
				gintag_details.tags = tag_indicator;
				$("#gintag_details_container").val(JSON.stringify(gintag_details));
				displayNarrativeConfirmation(gintag_details);
			} else {
				getGintagGroupContacts(gintag_details);
			}

		} else {
			if ($.inArray("#EwiResponse",tags) != -1 || $.inArray('#GroundMeas',tags) != -1) {
				var gintag_details = {
					"data": data,
					"cmd": "insert"
				};

				if ($.inArray("#EwiResponse",tags) != -1) {
					tag_indicator = "#EwiResponse"
				} else if ($.inArray('#GroundMeas',tags) != -1) {
					tag_indicator = "#GroundMeas";
				}
				var tags = $('#gintags').val();
				tags = tags.split(',');
				tags.splice($.inArray(tag_indicator, tags),1);
				$('#gintags').val(tags);
				gintag_details.tags = tag_indicator;
				if (tags[1] != "") {
					for (var i = 0; i < tags.length;i++) {
						gintags_collection = [];
						gintags = {
							'tag_name': tags[i],
							'tag_description': "communications",
							'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
							'tagger': tagger_user_id,
							'table_element_id': data[5],
							'table_used': data[6],
							'remarks': ""
						}
						gintags_collection.push(gintags);
						$.post( "../generalinformation/insertGinTags/", {gintags: gintags_collection})
						.done(function(response) {
							$( "#messages li" ).eq(message_li_index).addClass("tagged");
						});
					}
					$.notify("GINTAG successfully tagged!","success");
				}
				$("#gintag_details_container").val(JSON.stringify(gintag_details));
				displayNarrativeConfirmation(gintag_details);
			} else {
				for (var i = 0; i < tags.length;i++) {
					gintags_collection = [];
					gintags = {
						'tag_name': tags[i],
						'tag_description': "communications",
						'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
						'tagger': tagger_user_id,
						'table_element_id': data[5],
						'table_used': data[6],
						'remarks': ""
					}
					gintags_collection.push(gintags);
					$.post( "../generalinformation/insertGinTags/", {gintags: gintags_collection})
					.done(function(response) {
						$( "#messages li" ).eq(message_li_index).addClass("tagged");
					});
				}
				$.notify("GINTAG successfully tagged!","success");
			}
		}

	// } else {
	// 	for (var i = 0; i < tags.length;i++) {
	// 		gintags_collection = [];
	// 		gintags = {
	// 			'tag_name': tags[i],
	// 			'tag_description': "communications",
	// 			'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
	// 			'tagger': tagger_user_id,	
	// 			'table_element_id': data[5],
	// 			'table_used': data[6],
	// 			'remarks': ""
	// 		}
	// 		gintags_collection.push(gintags);
	// 		$.post( "../generalinformation/insertGinTags/", {gintags: gintags_collection})
	// 		.done(function(response) {
	// 			$( "#messages li" ).eq(message_li_index).addClass("tagged");
	// 		});
	// 	}
	// 	$.notify("GINTAG successfully tagged!","success");
	// }
}

function removeIndividualGintag(gintag_details){
	$.post("../generalinformation/removeIndividualGintagEntryViaChatterbox", {gintags: gintag_details})
	.done(function(response) {
		$.notify("GINTAG successfully removed!","success");
		$( "#messages li" ).eq(message_li_index).removeClass("tagged");
	});
}

function getGintagGroupContacts(gintag_details){
	if (gintag_details.cmd == "insert" ) {
		var tags = $('#gintags').val();
		tags = tags.split(',');
		if (tags[0] != "") {
			$.post( "../communications/chatterbox/gintagcontacts/", {gintags: JSON.stringify(gintag_details)})
			.done(function(response) {
				var data = JSON.parse(response);
				for (var i = 0; i < tags.length; i++) {
					gintags_collection = [];
					for (var x = 0 ; x < data.length; x++) {
						for (var y = 0; y < data[x].length; y++) {
							gintags = {
								'tag_name': tags[i],
								'tag_description': "communications",
								'timestamp': moment().format('YYYY-MM-DD HH:mm:ss'),
								'tagger': tagger_user_id,
								'table_element_id': data[x][y].sms_id,					
								'table_used': "smsoutbox",
								'remarks': ""
							}
							gintags_collection.push(gintags);
						}
					}
					if (gintags_collection != null || gintags_collection.length > 0) {
						$.post( "../generalinformation/insertGinTags/", {gintags: gintags_collection})
						.done(function(response) {
							$( "#messages li" ).eq(message_li_index).addClass("tagged");
						});
					}
				}
				$.notify("GINTAG successfully tagged ","success");
			});
		}
	} else if (gintag_details.cmd == "delete") {
		if (gintag_details.data[1] == "You") {
			$.post( "../communications/chatterbox/gintagcontacts/", {gintags: JSON.stringify(gintag_details)})
			.done(function(response) {
				var data = JSON.parse(response);
				var number_collection = [];
				for (var counter = 0; counter < data.length;counter++){
					var numbers = data[counter].number.split(',');
					for (var num_count = 0; num_count < numbers.length;num_count++){
						number_collection.push(numbers[num_count]);
					}
				}
				var toBeRemoved = {	
					'contact': number_collection,
					'details': gintag_details
				}
				console.log(toBeRemoved);
				$.post( "../generalinformation/removeGintagsEntryViaChatterbox/", {gintags: toBeRemoved})
				.done(function(response) {
					$.notify("GINTAG successfully removed!","success");
					$( "#messages li" ).eq(message_li_index).removeClass("tagged");
				});
			});
		} else {
			var toBeRemoved = {
				'details':gintag_details
			}
			$.post( "../generalinformation/removeGintagsEntryViaChatterbox/", {gintags: toBeRemoved})
			.done(function(response) {
				$.notify("GINTAG successfully removed!","success");
				$( "#messages li" ).eq(message_li_index).removeClass("tagged");
			});

		}
	}
}

$('#reset-gintags').on('click',function(){
	$('#gintags').val('');
	$('#gintags').tagsinput("removeAll");
	getGintagService(gintags_msg_details[5]);
});

var holdTags;
function getGintagService(data){
	$('#gintags').val('');
	$('#gintags').tagsinput("removeAll");
	$.get("/../../gintagshelper/getGinTagsViaTableElement/" + data, function(response) {
		for (var i = 0; i < response.length; i++) {
			$('#gintags').tagsinput('add',response[i].tag_name);
		}
		holdTags = $('#gintags').val();
	}, "json")
}

function updateContactService(data,wrapper){
	$.post( "../communications/chatterbox/updatecontacts", {contact: JSON.stringify(data)})
	.done(function(response) {
		console.log(response);
		if (wrapper == "employee-contact-wrapper") {
			getEmpContact();
		} else {
			getComContact();
		}
		if (response == "true") {
			$('#contact-result').remove();
			$.notify('Success! Existing contact updated.','success');
			$('#employee-contact-wrapper').prop('hidden',true);
			$('#community-contact-wrapper').prop('hidden', true);
		} else {
			$('#contact-result').remove();
			var container = document.getElementById(wrapper);
			var resContainer = document.createElement('div');
			resContainer.id = "contact-result";
			resContainer.className = "alert alert-danger";
			resContainer.innerHTML = "<strong>Failed!</strong> Invalid input data";
			container.insertBefore(resContainer,container.childNodes[0]);
		}
	});
}
});
