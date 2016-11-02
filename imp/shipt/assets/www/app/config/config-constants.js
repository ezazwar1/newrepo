angular.module("shiptApp.config", [])

.constant("ApiEndpoint", {
	"authurl": "https://app.shipt.com/api/v1/sessions.json",
	"apiurl": "https://app.shipt.com/",
	"photoUploadUrl": "https://admin.shipt.com/api/v1/photos.json"
})

.constant("IonicAppConfig", {
	"ionic_app_id": "49144f00",
	"ionic_api_key": "d574e86313439ce2c24052615b794181b08b0149971493ed"
})

;