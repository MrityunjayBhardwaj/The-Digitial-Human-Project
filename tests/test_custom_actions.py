import sys
import os
import json

PACKAGE_PARENT = '..'
SCRIPT_DIR = os.path.dirname(os.path.realpath(os.path.join(os.getcwd(), os.path.expanduser(__file__))))
BASE_DIR_PATH = os.path.normpath(os.path.join(SCRIPT_DIR, PACKAGE_PARENT))
sys.path.append(BASE_DIR_PATH)

# test names of all the custom actions
import pytest
from pytest_schema import schema

expected_init_examples_list_schema = [{
    "ex_1" : str,
    "ex_2" : str,
}
]

expected_therapist_info_list_schema = [{
    "link": str,
    "name": str,
    "summary": str,
    "location": {"lat": float, "lng": float}
}
]

def get_expected_prime_text(examples, max_examples=10):
    expected_prime_text = ''
    for i, curr_entry in enumerate(examples):
        if i == max_examples:
            break
        curr_line = 'input: '+ curr_entry['ex_1']+'\noutput: '+ curr_entry['ex_2']+'\n\n'
        expected_prime_text += curr_line

    print('expected'+expected_prime_text)
    return expected_prime_text

get_expected_prime_text( get_init_gpt_examples())
    
def test_init_examples_list_schema():
    init_examples = get_init_gpt_examples()
    assert schema(expected_init_examples_list_schema) == init_examples

def test_if_init_gpt_uses_init_examples_as_prompts_correctly():
    """
    check if our gpt object uses our init_examples and correctly creates prime text before sending to openai server.
    """
    gpt = init()
    init_examples = get_init_gpt_examples()
    expected_prime_text = get_expected_prime_text(init_examples)
    assert (gpt.get_prime_text() == expected_prime_text)

def check_fetch_gp3_response_return_type():
    input_text = 'this is good'
    final_respose = fetch_gpt3_response(input_text=input_text)
    expected_response_type = str
    assert type(final_respose) is expected_response_type

def test_create_theripst_info_json_message_schema():
    json_message = create_therapist_info_json_message()
    therapists_list = json_message['therapists']
    assert schema(expected_therapist_info_list_schema) == therapists_list

def test_chat_gpt3_action_has_expected_custom_action_name():
    """
    check if the custom action name is consistent with what rasa server expects.
    """
    chat_gpt3_action_obj = chat_gpt3_action()
    chat_gpt3_name = chat_gpt3_action_obj.name()
    expected_name = "chat_gpt3"
    assert chat_gpt3_name == expected_name

def test_fetch_therapist_info_has_expected_custom_action_name():
    """
    check if the custom action name is consistent with what rasa server expects.
    """
    fetch_therapist_info_obj = fetch_therapist_info()
    fetch_therapist_info_name = fetch_therapist_info_obj.name()
    expected_name = "therapist_info"
    assert fetch_therapist_info_name == expected_name
