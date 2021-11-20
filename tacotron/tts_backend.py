from flask import Flask
import torch
from scipy.io.wavfile import write
app = Flask(__name__)



def tacotron_tts(message):
    tacotron2 = torch.hub.load('NVIDIA/DeepLearningExamples:torchhub', 'nvidia_tacotron2', model_math='fp16')
    tacotron2 = tacotron2.to('cuda')
    tacotron2.eval()
    waveglow = torch.hub.load('NVIDIA/DeepLearningExamples:torchhub', 'nvidia_waveglow', model_math='fp16')
    waveglow = waveglow.remove_weightnorm(waveglow)
    waveglow = waveglow.to('cuda')
    waveglow.eval()
    utils = torch.hub.load('NVIDIA/DeepLearningExamples:torchhub', 'nvidia_tts_utils')
    sequences, lengths = utils.prepare_input_sequence([text])
    with torch.no_grad():
        mel, _, _ = tacotron2.infer(sequences, lengths)
        audio = waveglow.infer(mel)
    audio_numpy = audio[0].data.cpu().numpy()
    rate = 22050
    audio_file_name = "audio.wav"
    write(audio_file_name, rate, audio_numpy)
    return audio_file_name

@app.route('/speak', method=['POST'])
def speak():
     input_json = request.get_json(force=True) 
     message = input_json['message']
     saved_audio_file_name = tacotron_tts(message)
     response = {'audio_file_name': saved_audio_file_name}
     return response


if __name__ == '__main__':
      app.run(host='0.0.0.0', port=4001)
