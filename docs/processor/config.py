import json

def get_config():
  settings = None
  diff_timestamp = None

  with open('./docs/diff_timestamp.json', 'r') as file_timestamp:
    diff_timestamp = json.load(file_timestamp)

  with open('./docs/settings.json', 'r') as settings_file:
    settings = json.load(settings_file)

  is_test_mode = settings['mode'] == 'test'
  is_diff_mode = settings['mode'] == 'diff'

  def get_output_dir(path: str):
    module = settings['module']
    package = settings['package']
    final_dir = module

    if is_diff_mode:
      final_dir = f'diff_{diff_timestamp}'
    elif is_test_mode:
      final_dir = f'test_{module}'

    return f'{path}/{package}/{final_dir}'

  settings['articlesOutputDir'] = get_output_dir(settings['articlesOutputDir'])
  settings['typedocsOutputDir'] = get_output_dir(settings['typedocsOutputDir'])

  return settings
