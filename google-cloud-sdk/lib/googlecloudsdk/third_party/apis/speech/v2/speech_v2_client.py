"""Generated client library for speech version v2."""
# NOTE: This file is autogenerated and should not be edited by hand.

from __future__ import absolute_import

from apitools.base.py import base_api
from googlecloudsdk.third_party.apis.speech.v2 import speech_v2_messages as messages


class SpeechV2(base_api.BaseApiClient):
  """Generated client library for service speech version v2."""

  MESSAGES_MODULE = messages
  BASE_URL = 'https://speech.googleapis.com/'
  MTLS_BASE_URL = 'https://speech.mtls.googleapis.com/'

  _PACKAGE = 'speech'
  _SCOPES = ['https://www.googleapis.com/auth/cloud-platform']
  _VERSION = 'v2'
  _CLIENT_ID = 'CLIENT_ID'
  _CLIENT_SECRET = 'CLIENT_SECRET'
  _USER_AGENT = 'google-cloud-sdk'
  _CLIENT_CLASS_NAME = 'SpeechV2'
  _URL_VERSION = 'v2'
  _API_KEY = None

  def __init__(self, url='', credentials=None,
               get_credentials=True, http=None, model=None,
               log_request=False, log_response=False,
               credentials_args=None, default_global_params=None,
               additional_http_headers=None, response_encoding=None):
    """Create a new speech handle."""
    url = url or self.BASE_URL
    super(SpeechV2, self).__init__(
        url, credentials=credentials,
        get_credentials=get_credentials, http=http, model=model,
        log_request=log_request, log_response=log_response,
        credentials_args=credentials_args,
        default_global_params=default_global_params,
        additional_http_headers=additional_http_headers,
        response_encoding=response_encoding)
    self.projects_locations_operations = self.ProjectsLocationsOperationsService(self)
    self.projects_locations_recognizers = self.ProjectsLocationsRecognizersService(self)
    self.projects_locations = self.ProjectsLocationsService(self)
    self.projects = self.ProjectsService(self)

  class ProjectsLocationsOperationsService(base_api.BaseApiService):
    """Service class for the projects_locations_operations resource."""

    _NAME = 'projects_locations_operations'

    def __init__(self, client):
      super(SpeechV2.ProjectsLocationsOperationsService, self).__init__(client)
      self._upload_configs = {
          }

    def Get(self, request, global_params=None):
      r"""Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.

      Args:
        request: (SpeechProjectsLocationsOperationsGetRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Operation) The response message.
      """
      config = self.GetMethodConfig('Get')
      return self._RunMethod(
          config, request, global_params=global_params)

    Get.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2/projects/{projectsId}/locations/{locationsId}/operations/{operationsId}',
        http_method='GET',
        method_id='speech.projects.locations.operations.get',
        ordered_params=['name'],
        path_params=['name'],
        query_params=[],
        relative_path='v2/{+name}',
        request_field='',
        request_type_name='SpeechProjectsLocationsOperationsGetRequest',
        response_type_name='Operation',
        supports_download=False,
    )

    def List(self, request, global_params=None):
      r"""Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`. NOTE: the `name` binding allows API services to override the binding to use different resource name schemes, such as `users/*/operations`. To override the binding, API services can add a binding such as `"/v1/{name=users/*}/operations"` to their service configuration. For backwards compatibility, the default name includes the operations collection id, however overriding users must ensure the name binding is the parent resource, without the operations collection id.

      Args:
        request: (SpeechProjectsLocationsOperationsListRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (ListOperationsResponse) The response message.
      """
      config = self.GetMethodConfig('List')
      return self._RunMethod(
          config, request, global_params=global_params)

    List.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2/projects/{projectsId}/locations/{locationsId}/operations',
        http_method='GET',
        method_id='speech.projects.locations.operations.list',
        ordered_params=['name'],
        path_params=['name'],
        query_params=['filter', 'pageSize', 'pageToken'],
        relative_path='v2/{+name}/operations',
        request_field='',
        request_type_name='SpeechProjectsLocationsOperationsListRequest',
        response_type_name='ListOperationsResponse',
        supports_download=False,
    )

  class ProjectsLocationsRecognizersService(base_api.BaseApiService):
    """Service class for the projects_locations_recognizers resource."""

    _NAME = 'projects_locations_recognizers'

    def __init__(self, client):
      super(SpeechV2.ProjectsLocationsRecognizersService, self).__init__(client)
      self._upload_configs = {
          }

    def Create(self, request, global_params=None):
      r"""Creates a Recognizer in the given project at the given location.

      Args:
        request: (SpeechProjectsLocationsRecognizersCreateRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Operation) The response message.
      """
      config = self.GetMethodConfig('Create')
      return self._RunMethod(
          config, request, global_params=global_params)

    Create.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2/projects/{projectsId}/locations/{locationsId}/recognizers',
        http_method='POST',
        method_id='speech.projects.locations.recognizers.create',
        ordered_params=['parent'],
        path_params=['parent'],
        query_params=['recognizerId', 'validateOnly'],
        relative_path='v2/{+parent}/recognizers',
        request_field='recognizer',
        request_type_name='SpeechProjectsLocationsRecognizersCreateRequest',
        response_type_name='Operation',
        supports_download=False,
    )

    def Delete(self, request, global_params=None):
      r"""Deletes the Recognizer.

      Args:
        request: (SpeechProjectsLocationsRecognizersDeleteRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Operation) The response message.
      """
      config = self.GetMethodConfig('Delete')
      return self._RunMethod(
          config, request, global_params=global_params)

    Delete.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2/projects/{projectsId}/locations/{locationsId}/recognizers/{recognizersId}',
        http_method='DELETE',
        method_id='speech.projects.locations.recognizers.delete',
        ordered_params=['name'],
        path_params=['name'],
        query_params=['allowMissing', 'etag', 'validateOnly'],
        relative_path='v2/{+name}',
        request_field='',
        request_type_name='SpeechProjectsLocationsRecognizersDeleteRequest',
        response_type_name='Operation',
        supports_download=False,
    )

    def Get(self, request, global_params=None):
      r"""Returns the requested Recognizer. Fails with NOT_FOUND if the requested recognizer doesn't exist.

      Args:
        request: (SpeechProjectsLocationsRecognizersGetRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Recognizer) The response message.
      """
      config = self.GetMethodConfig('Get')
      return self._RunMethod(
          config, request, global_params=global_params)

    Get.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2/projects/{projectsId}/locations/{locationsId}/recognizers/{recognizersId}',
        http_method='GET',
        method_id='speech.projects.locations.recognizers.get',
        ordered_params=['name'],
        path_params=['name'],
        query_params=[],
        relative_path='v2/{+name}',
        request_field='',
        request_type_name='SpeechProjectsLocationsRecognizersGetRequest',
        response_type_name='Recognizer',
        supports_download=False,
    )

    def List(self, request, global_params=None):
      r"""Lists the Recognizers in the given project in the given region.

      Args:
        request: (SpeechProjectsLocationsRecognizersListRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (ListRecognizersResponse) The response message.
      """
      config = self.GetMethodConfig('List')
      return self._RunMethod(
          config, request, global_params=global_params)

    List.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2/projects/{projectsId}/locations/{locationsId}/recognizers',
        http_method='GET',
        method_id='speech.projects.locations.recognizers.list',
        ordered_params=['parent'],
        path_params=['parent'],
        query_params=['pageSize', 'pageToken', 'showDeleted'],
        relative_path='v2/{+parent}/recognizers',
        request_field='',
        request_type_name='SpeechProjectsLocationsRecognizersListRequest',
        response_type_name='ListRecognizersResponse',
        supports_download=False,
    )

    def Patch(self, request, global_params=None):
      r"""Updates the Recognizer.

      Args:
        request: (SpeechProjectsLocationsRecognizersPatchRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Operation) The response message.
      """
      config = self.GetMethodConfig('Patch')
      return self._RunMethod(
          config, request, global_params=global_params)

    Patch.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2/projects/{projectsId}/locations/{locationsId}/recognizers/{recognizersId}',
        http_method='PATCH',
        method_id='speech.projects.locations.recognizers.patch',
        ordered_params=['name'],
        path_params=['name'],
        query_params=['allowMissing', 'updateMask', 'validateOnly'],
        relative_path='v2/{+name}',
        request_field='recognizer',
        request_type_name='SpeechProjectsLocationsRecognizersPatchRequest',
        response_type_name='Operation',
        supports_download=False,
    )

    def Recognize(self, request, global_params=None):
      r"""Performs synchronous Speech recognition: receive results after all audio has been sent and processed.

      Args:
        request: (SpeechProjectsLocationsRecognizersRecognizeRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (RecognizeResponse) The response message.
      """
      config = self.GetMethodConfig('Recognize')
      return self._RunMethod(
          config, request, global_params=global_params)

    Recognize.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2/projects/{projectsId}/locations/{locationsId}/recognizers/{recognizersId}:recognize',
        http_method='POST',
        method_id='speech.projects.locations.recognizers.recognize',
        ordered_params=['recognizer'],
        path_params=['recognizer'],
        query_params=[],
        relative_path='v2/{+recognizer}:recognize',
        request_field='recognizeRequest',
        request_type_name='SpeechProjectsLocationsRecognizersRecognizeRequest',
        response_type_name='RecognizeResponse',
        supports_download=False,
    )

    def Undelete(self, request, global_params=None):
      r"""Undeletes the Recognizer.

      Args:
        request: (UndeleteRecognizerRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Operation) The response message.
      """
      config = self.GetMethodConfig('Undelete')
      return self._RunMethod(
          config, request, global_params=global_params)

    Undelete.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2/projects/{projectsId}/locations/{locationsId}/recognizers/{recognizersId}:undelete',
        http_method='POST',
        method_id='speech.projects.locations.recognizers.undelete',
        ordered_params=['name'],
        path_params=['name'],
        query_params=[],
        relative_path='v2/{+name}:undelete',
        request_field='<request>',
        request_type_name='UndeleteRecognizerRequest',
        response_type_name='Operation',
        supports_download=False,
    )

  class ProjectsLocationsService(base_api.BaseApiService):
    """Service class for the projects_locations resource."""

    _NAME = 'projects_locations'

    def __init__(self, client):
      super(SpeechV2.ProjectsLocationsService, self).__init__(client)
      self._upload_configs = {
          }

    def UpdateConfig(self, request, global_params=None):
      r"""Updates the Speech-to-Text config for a given project in a given location.

      Args:
        request: (SpeechProjectsLocationsUpdateConfigRequest) input message
        global_params: (StandardQueryParameters, default: None) global arguments
      Returns:
        (Config) The response message.
      """
      config = self.GetMethodConfig('UpdateConfig')
      return self._RunMethod(
          config, request, global_params=global_params)

    UpdateConfig.method_config = lambda: base_api.ApiMethodInfo(
        flat_path='v2/projects/{projectsId}/locations/{locationsId}/config',
        http_method='PATCH',
        method_id='speech.projects.locations.updateConfig',
        ordered_params=['name'],
        path_params=['name'],
        query_params=['updateMask'],
        relative_path='v2/{+name}',
        request_field='config',
        request_type_name='SpeechProjectsLocationsUpdateConfigRequest',
        response_type_name='Config',
        supports_download=False,
    )

  class ProjectsService(base_api.BaseApiService):
    """Service class for the projects resource."""

    _NAME = 'projects'

    def __init__(self, client):
      super(SpeechV2.ProjectsService, self).__init__(client)
      self._upload_configs = {
          }
