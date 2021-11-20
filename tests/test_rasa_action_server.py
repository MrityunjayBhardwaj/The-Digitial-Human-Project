
import sys
import os
import json
import subprocess
import time
import asyncio

PACKAGE_PARENT = '..'
SCRIPT_DIR = os.path.dirname(os.path.realpath(os.path.join(os.getcwd(), os.path.expanduser(__file__))))
BASE_DIR_PATH = os.path.normpath(os.path.join(SCRIPT_DIR, PACKAGE_PARENT))
sys.path.append(BASE_DIR_PATH)

from backend.actions.actions import (fetch_gpt3_response, GPT, get_init_gpt_examples, init, create_therapist_info_json_message, fetch_therapist_info, chat_gpt3_action)
from rasa.core.actions.action import (Action)
from rasa.shared.core.events import (BotUttered)
from rasa.core.constants import DEFAULT_REQUEST_TIMEOUT
from rasa.core.utils import AvailableEndpoints as endpoints

import pytest
from pytest_schema import schema

"""
TODO tests:
    test gpt3 custom action response
    test therapists custom action response
    + incorporate setup and teardown for each of the tests.
"""

async def wait_for_rasa_custom_action_server():
    # TODO: wait untill the url localhost:5055 opens.
     await asyncio.sleep(5)
     return True

def setup_action_server():
    os.system('cd '+BASE_DIR_PATH+'/backend'+' && '+ 'rasa run '+'actions &')

def teardown_action_server():
    os.system('fuser -k -n tcp 5055')


@pytest.fixture(autouse=True)
async def run_around_rasa_action_server_tests():
    setup_action_server()
    await wait_for_rasa_custom_action_server()
    yield
    teardown_action_server()

@pytest.mark.asyncio
async def test_natural_custom_action_response():
    action_endpoint = endpoints.read_endpoints(BASE_DIR_PATH+'/backend/endpoints.yml').action
    with open(BASE_DIR_PATH+'/tests/test_data/natural_action_data.json', "r") as read_file:
        input_data = json.load(read_file)
    response = await action_endpoint.request(
        json=input_data, method="post", timeout=DEFAULT_REQUEST_TIMEOUT
    )
    print('response: ', response)
    assert type(response) == dict

async def test_business_logic_custom_action_response():
    action_endpoint = endpoints.read_endpoints(BASE_DIR_PATH+'/backend/endpoints.yml').action
    with open(BASE_DIR_PATH+'/tests/test_data/business_logic_action_data.json', "r") as read_file:
        input_data = json.load(read_file)
    response = await action_endpoint.request(
        json=input_data, method="post", timeout=DEFAULT_REQUEST_TIMEOUT
    )
    print('response: ', response)
    assert type(response) == dict
