#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
백엔드 파일들의 import 경로 수정 스크립트
'from backend.' -> 'from '으로 변경
"""
import os
import re

def fix_imports(directory):
    """디렉토리 내 모든 Python 파일의 import 수정"""
    fixed_files = []
    
    for root, dirs, files in os.walk(directory):
        # __pycache__ 제외
        dirs[:] = [d for d in dirs if d != '__pycache__']
        
        for file in files:
            if file.endswith('.py'):
                filepath = os.path.join(root, file)
                try:
                    # UTF-8로 파일 읽기
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # from backend. -> from 으로 변경
                    new_content = re.sub(r'from backend\.', 'from ', content)
                    
                    # 변경사항이 있으면 파일 저장
                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        fixed_files.append(filepath)
                        print(f"✓ Fixed: {filepath}")
                except Exception as e:
                    print(f"✗ Error in {filepath}: {e}")
    
    return fixed_files

if __name__ == '__main__':
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    print("🔧 Fixing import paths in backend files...")
    print(f"Directory: {backend_dir}\n")
    
    fixed = fix_imports(backend_dir)
    
    print(f"\n✅ Complete! Fixed {len(fixed)} files.")
