import os
from striprtf.striprtf import rtf_to_text


def rtf_decoder(input_dir, output_dir):
  """ Function to convert a folder of RTF files to text files 
  
  Args:
    input_dir: The directory containing the RTF files
    output_dir: The directory to save the text files
  
  """
  for root, _, files in os.walk(input_dir):
    for file in files:
      print(f'Processing {file}/{len(files)}', end='\r')
      if file.endswith('.rtf'):
        output_path = file.replace('.rtf', '.txt')
        with open(os.path.join(root, file), 'r') as f:
          rtf_text = f.read()
          text = rtf_to_text(rtf_text)
          with open(os.path.join(output_dir, output_path), 'w', errors='ignore') as f:
            f.write(text)

  
