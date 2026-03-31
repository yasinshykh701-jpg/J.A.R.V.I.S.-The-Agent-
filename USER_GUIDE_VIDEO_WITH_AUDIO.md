# Quick User Guide: Video Generation with Audio

## 🎬 How to Create Videos with Voice

### Step 1: Generate Your Video
1. Open the Video Generation page
2. Enter your video prompt (e.g., "A cat playing with a ball")
3. Select duration: **5-15 seconds recommended**
4. ✅ **Check "Generate Voice Narration"**
5. Select your language (English, Hindi, Marathi, or Arabic)
6. Click "Generate Video"

### Step 2: Wait for Generation
- Qazyene will announce: "I'm generating your video now. Please wait..."
- Watch the progress bar
- When complete: "Your video is ready! I hope you like it."

### Step 3: Download Both Files
1. **Download Video** - Click the "Download Video" button
2. **Download Narration** - Click the "Download Narration (MP3)" button
3. You now have two files:
   - `video-[timestamp].mp4` (silent video)
   - `video-narration-[timestamp].mp3` (voice narration)

### Step 4: Combine Video and Audio

#### Option A: Use CapCut (Easiest - Free)
**Mobile (iOS/Android)**:
1. Open CapCut app
2. Tap "New Project"
3. Select your video file
4. Tap "Audio" → "Sounds" → "Import"
5. Select your narration MP3
6. Adjust timing if needed
7. Tap "Export" → Save to phone

**Desktop (Windows/Mac)**:
1. Open CapCut
2. Click "Import" → Add video and audio
3. Drag both to timeline
4. Align audio with video
5. Click "Export" → Save

#### Option B: Use Online Tool (No Installation)
**Kapwing.com** (Recommended):
1. Go to https://www.kapwing.com
2. Click "Add Audio to Video"
3. Upload your video file
4. Click "Add Audio" → Upload narration MP3
5. Click "Export" → Download

**Clideo.com**:
1. Go to https://clideo.com/add-audio-to-video
2. Click "Choose file" → Upload video
3. Click "Add audio" → Upload narration
4. Click "Export" → Download

**VEED.io**:
1. Go to https://www.veed.io
2. Click "Upload Video"
3. Click "Audio" → "Upload Audio"
4. Select narration MP3
5. Click "Export" → Download

#### Option C: Use Desktop Software (Advanced)
**iMovie (Mac)**:
1. Open iMovie
2. Create new project
3. Import video and audio
4. Drag both to timeline
5. File → Share → File

**DaVinci Resolve (Windows/Mac/Linux)**:
1. Open DaVinci Resolve
2. Create new project
3. Import media
4. Drag to timeline
5. File → Deliver → Render

## ⚠️ Important Notes

### About Video Duration
- **Best Results**: 5-15 seconds
- **Why**: The AI video API works best with short videos
- **If Longer**: The API may generate a 5-second video instead
- **Solution**: Create multiple short videos and combine them

### About Video Audio
- **Generated videos are silent** - This is how the AI works
- **Voice narration is separate** - You need to combine them
- **Takes 2-3 minutes** - Using CapCut or online tools
- **Worth it** - Your videos will be professional with voice!

### Checking Video Duration
After your video loads, check the "Video Information" section:
```
📊 Video Information:
Requested Duration: 60s
Actual Duration: 5.00s
```

If they don't match, the API has limitations. Use shorter durations.

## 🎯 Best Practices

### For Short Social Media Videos (5-15s)
1. Use 5-15 second duration
2. Enable voice narration
3. Combine in CapCut (mobile) or Kapwing (online)
4. Perfect for Instagram, TikTok, YouTube Shorts

### For Longer Content (30s+)
1. Create multiple 10-15 second videos
2. Enable voice narration for each
3. Combine all clips in CapCut or DaVinci Resolve
4. Add transitions between clips
5. Export final video

### For Multilingual Content
1. Select your language before generating
2. Voice narration will be in that language
3. Perfect for reaching global audiences
4. Supports: English, Hindi (हिंदी), Marathi (मराठी), Arabic (العربية)

## 🔧 Troubleshooting

### Problem: Video is only 5 seconds
**Solution**: 
- The API works best with 5-15 second videos
- Try 10 or 15 seconds instead of longer durations
- Create multiple short videos for longer content

### Problem: Video has no sound
**Solution**:
- This is normal! Videos are silent by default
- Enable "Generate Voice Narration" checkbox
- Download the narration MP3
- Combine using CapCut or Kapwing

### Problem: Narration doesn't match video length
**Solution**:
- Write a longer, more detailed prompt for longer narration
- Use video editing software to adjust timing
- Add background music to fill gaps
- Loop the narration if needed

### Problem: Can't combine video and audio
**Solution**:
- Try CapCut (easiest, free, mobile + desktop)
- Try Kapwing.com (online, no installation)
- Watch YouTube tutorials: "How to add audio to video in CapCut"

## 📱 Recommended Tools

### Free Mobile Apps
- **CapCut** ⭐ (Best for beginners)
- **InShot**
- **KineMaster**
- **PowerDirector**

### Free Desktop Software
- **CapCut** ⭐ (Best for beginners)
- **DaVinci Resolve** (Professional)
- **OpenShot** (Simple)
- **Shotcut** (Lightweight)

### Online Tools (No Installation)
- **Kapwing.com** ⭐ (Best for quick edits)
- **Clideo.com**
- **VEED.io**
- **FlexClip.com**

## 💡 Pro Tips

1. **Write Detailed Prompts**: More detail = better videos
   - ❌ "A cat"
   - ✅ "A fluffy orange cat playing with a red ball in a sunny garden"

2. **Use Voice Narration**: Makes videos more engaging
   - Adds professionalism
   - Better for accessibility
   - Increases viewer retention

3. **Start Short**: Master 5-15 second videos first
   - Learn the tools
   - Understand the workflow
   - Then create longer content

4. **Combine Multiple Videos**: For longer content
   - Create 3-4 short videos
   - Combine in CapCut
   - Add transitions
   - Professional result!

5. **Check Console Logs**: If something seems wrong
   - Press F12 in browser
   - Look for "VIDEO GENERATION" logs
   - See what duration was actually sent
   - Report issues with log details

## 🎓 Learning Resources

### Video Tutorials
- YouTube: "How to add audio to video in CapCut"
- YouTube: "CapCut tutorial for beginners"
- YouTube: "How to use Kapwing"

### Written Guides
- CapCut Help Center: https://www.capcut.com/help
- Kapwing Blog: https://www.kapwing.com/resources

## 📞 Need Help?

### Check the Console
1. Press F12 in your browser
2. Click "Console" tab
3. Look for these logs:
   - "VIDEO GENERATION STARTED" - Shows your settings
   - "VIDEO GENERATION COMPLETE" - Shows API response
   - "VIDEO METADATA LOADED" - Shows actual video duration

### Common Issues
- **Duration mismatch**: API limitation, use 5-15 seconds
- **No audio**: Enable voice narration, combine files
- **Generation failed**: Try shorter duration or simpler prompt

## ✨ Example Workflow

**Goal**: Create a 10-second video with voice about a sunset

1. **Generate**:
   - Prompt: "A beautiful sunset over the ocean with waves crashing on the beach"
   - Duration: 10 seconds
   - ✅ Generate Voice Narration
   - Language: English
   - Click "Generate Video"

2. **Wait**: 
   - ~3-5 minutes for video
   - Narration generates automatically

3. **Download**:
   - Download Video button → `video-123456.mp4`
   - Download Narration button → `video-narration-123456.mp3`

4. **Combine** (CapCut Mobile):
   - Open CapCut
   - New Project → Select video
   - Audio → Import → Select narration
   - Export → Save

5. **Result**:
   - 10-second video with professional voice narration
   - Ready to share on social media!

**Total Time**: ~5-8 minutes (3-5 min generation + 2-3 min editing)

---

**Remember**: The key to great videos is:
1. ✅ Use 5-15 second durations
2. ✅ Enable voice narration
3. ✅ Combine using CapCut or Kapwing
4. ✅ Share and enjoy!

Happy video creating with Qazyene! 🎬✨
