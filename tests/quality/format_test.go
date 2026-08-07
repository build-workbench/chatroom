package quality

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

// TestProperty_CodeFormattingConsistency 验证项目内所有 Go 源文件符合 gofmt 格式。
func TestProperty_CodeFormattingConsistency(t *testing.T) {
	// Find project root (go up from tests/quality)
	projectRoot, err := findProjectRoot()
	if err != nil {
		t.Fatalf("Failed to find project root: %v", err)
	}

	// Collect all Go files
	var goFiles []string
	err = filepath.Walk(projectRoot, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Skip vendor, .git, and other non-source directories
		if info.IsDir() {
			name := info.Name()
			if name == "vendor" || name == ".git" || name == "node_modules" {
				return filepath.SkipDir
			}
			return nil
		}

		// Only check .go files
		if strings.HasSuffix(path, ".go") {
			goFiles = append(goFiles, path)
		}
		return nil
	})
	if err != nil {
		t.Fatalf("Failed to walk project directory: %v", err)
	}

	if len(goFiles) == 0 {
		t.Fatal("No Go files found in project")
	}

	// Check each file with gofmt
	var unformattedFiles []string
	for _, file := range goFiles {
		cmd := exec.Command("gofmt", "-d", file)
		output, err := cmd.Output()
		if err != nil {
			// gofmt returns non-zero if there are syntax errors
			t.Errorf("gofmt failed for %s: %v", file, err)
			continue
		}

		if len(output) > 0 {
			unformattedFiles = append(unformattedFiles, file)
			t.Errorf("File %s is not properly formatted:\n%s", file, string(output))
		}
	}

	if len(unformattedFiles) > 0 {
		t.Errorf("\nProperty violated: %d files are not properly formatted", len(unformattedFiles))
		t.Log("Run 'make fmt' or 'go fmt ./...' to fix formatting")
	}

	t.Logf("Checked %d Go files for formatting consistency", len(goFiles))
}

// findProjectRoot finds the project root by looking for go.mod
func findProjectRoot() (string, error) {
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}

	for {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			return dir, nil
		}

		parent := filepath.Dir(dir)
		if parent == dir {
			return "", os.ErrNotExist
		}
		dir = parent
	}
}
