# Contributing to ChikRice Backend

Thank you for your interest in contributing to ChikRice Backend! This document provides guidelines and setup instructions for contributors.

## 📝 Development Guidelines

### Code Style

- Use ESLint and Prettier for code formatting
- Follow the existing code style
- Write meaningful commit messages

### Git Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Examples:

- `feat(auth): add google login`
- `fix(api): resolve user validation issue`
- `docs(readme): update setup instructions`

### Recommended VS Code Extensions

To ensure a consistent development experience, we recommend installing the following VS Code extensions:

#### Essential Extensions

- **ESLint** (`dbaeumer.vscode-eslint`) - JavaScript/TypeScript linting
- **Prettier** (`esbenp.prettier-vscode`) - Code formatting
- **Docker** (`ms-azuretools.vscode-docker`) - Docker container management
- **Dev Containers** (`ms-vscode-remote.remote-containers`) - Container development tools

#### Testing Extensions

- **Jest** (`orta.vscode-jest`) - Jest testing framework support
- **Jest Runner** (`firsttris.vscode-jest-runner`) - Run individual Jest tests

### VS Code Configuration

This project includes a `.vscode/settings.json` file that automatically configures:

- **Format on Save**: Automatically formats code using Prettier when you save files
- **ESLint Auto-fix**: Automatically fixes ESLint issues on save
- **Default Formatter**: Sets Prettier as the default formatter

The configuration ensures consistent code formatting across all contributors.

## 🐛 Reporting Issues

When reporting issues, please include:

- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Any error messages or logs

## 🤝 Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Add tests for new functionality
3. Update documentation if needed
4. Ensure all tests pass
5. Update the CHANGELOG.md if applicable

## 📚 Additional Resources

- [API Documentation](./docs/api/README.md)
- [Database Schema](./docs/database/README.md)
- [Architecture Overview](./docs/architecture/README.md)

## 🆘 Getting Help

- Check existing issues and pull requests
- Join our community discussions
- Create an issue for bugs or feature requests

Thank you for contributing to ChikRice Backend! 🎉
