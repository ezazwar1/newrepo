# Get the directory that this configuration file exists in
dir = File.dirname(__FILE__)

relative_assets  = true

# Compass configurations
sass_path = dir
css_path = File.join(dir, "..", "css")

# Require any additional compass plugins here.
images_dir = File.join(dir, "..", "images")

fonts_dir = File.join('../fonts')

output_style = :compressed
environment = :production


